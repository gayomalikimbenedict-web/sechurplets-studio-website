"""Database layer.

Local development / tests: SQLite file (store.db).
Production on Vercel: Postgres via DATABASE_URL (Vercel's filesystem is not persistent,
so a SQLite file there would silently lose orders; we refuse to start without DATABASE_URL).
"""
import os
import sqlite3
from contextlib import contextmanager

from .catalog import PRODUCTS

SQLITE_SCHEMA = """
CREATE TABLE IF NOT EXISTS products (
    product_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    slug        TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents > 0)
);
CREATE TABLE IF NOT EXISTS orders (
    order_id          INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_email    TEXT NOT NULL,
    total_cents       INTEGER NOT NULL CHECK (total_cents > 0),
    currency          TEXT NOT NULL,
    status            TEXT NOT NULL CHECK (status IN ('PENDING','PAID','FAILED','REVIEW')),
    receipt_key       TEXT NOT NULL,
    paypal_order_id   TEXT UNIQUE,
    paypal_capture_id TEXT UNIQUE,
    created_at        TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_at           TEXT
);
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id         INTEGER NOT NULL REFERENCES orders(order_id),
    product_id       INTEGER NOT NULL REFERENCES products(product_id),
    quantity         INTEGER NOT NULL DEFAULT 1 CHECK (quantity = 1),
    unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0)
);
"""

POSTGRES_SCHEMA = """
CREATE TABLE IF NOT EXISTS products (
    product_id  SERIAL PRIMARY KEY,
    slug        TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents > 0)
);
CREATE TABLE IF NOT EXISTS orders (
    order_id          SERIAL PRIMARY KEY,
    customer_email    TEXT NOT NULL,
    total_cents       INTEGER NOT NULL CHECK (total_cents > 0),
    currency          TEXT NOT NULL,
    status            TEXT NOT NULL CHECK (status IN ('PENDING','PAID','FAILED','REVIEW')),
    receipt_key       TEXT NOT NULL,
    paypal_order_id   TEXT UNIQUE,
    paypal_capture_id TEXT UNIQUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    paid_at           TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id    SERIAL PRIMARY KEY,
    order_id         INTEGER NOT NULL REFERENCES orders(order_id),
    product_id       INTEGER NOT NULL REFERENCES products(product_id),
    quantity         INTEGER NOT NULL DEFAULT 1 CHECK (quantity = 1),
    unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0)
);
"""


class ConfigError(RuntimeError):
    pass


class Tx:
    """One transaction. Use only inside `with db.transaction() as tx:`."""

    def __init__(self, conn, is_pg):
        self.conn, self.is_pg = conn, is_pg

    def execute(self, sql, params=()):
        if self.is_pg:
            sql = sql.replace('?', '%s')
        cur = self.conn.cursor()
        cur.execute(sql, params)
        return cur

    def one(self, sql, params=()):
        row = self.execute(sql, params).fetchone()
        return dict(row) if row is not None else None

    def all(self, sql, params=()):
        return [dict(r) for r in self.execute(sql, params).fetchall()]

    def insert(self, sql, params, id_column):
        """INSERT and return the new row's id on both engines."""
        if self.is_pg:
            return self.execute(sql + ' RETURNING ' + id_column, params).fetchone()[id_column]
        return self.execute(sql, params).lastrowid


class Database:
    def __init__(self, url=None, sqlite_path=None):
        url = url if url is not None else os.environ.get('DATABASE_URL')
        self.url = url or None
        self.is_pg = bool(self.url)
        if not self.is_pg:
            if os.environ.get('VERCEL'):
                raise ConfigError('DATABASE_URL is not set. Orders cannot be stored on Vercel without a Postgres database.')
            self.sqlite_path = sqlite_path or os.environ.get('SQLITE_PATH') or 'store.db'

    def _connect(self):
        if self.is_pg:
            import psycopg  # listed in requirements.txt; only needed in production
            from psycopg.rows import dict_row
            return psycopg.connect(self.url, row_factory=dict_row, autocommit=False)
        conn = sqlite3.connect(self.sqlite_path, isolation_level=None, timeout=15)
        conn.row_factory = sqlite3.Row
        conn.execute('PRAGMA foreign_keys = ON')
        return conn

    @contextmanager
    def transaction(self):
        """BEGIN ... COMMIT; any exception triggers ROLLBACK."""
        conn = self._connect()
        try:
            if not self.is_pg:
                conn.execute('BEGIN IMMEDIATE')
            tx = Tx(conn, self.is_pg)
            yield tx
            conn.commit() if self.is_pg else conn.execute('COMMIT')
        except BaseException:
            try:
                conn.rollback() if self.is_pg else conn.execute('ROLLBACK')
            except Exception:
                pass
            raise
        finally:
            conn.close()

    def init_schema(self):
        """Create tables and (re)seed the catalog. Safe to run repeatedly."""
        with self.transaction() as tx:
            for stmt in (POSTGRES_SCHEMA if self.is_pg else SQLITE_SCHEMA).split(';'):
                if stmt.strip():
                    tx.execute(stmt)
            for slug, name, cents in PRODUCTS:
                tx.execute(
                    'INSERT INTO products (slug, name, price_cents) VALUES (?, ?, ?) '
                    'ON CONFLICT (slug) DO UPDATE SET name = excluded.name, price_cents = excluded.price_cents',
                    (slug, name, cents))


if __name__ == '__main__':
    Database().init_schema()
    print('Database ready.')
