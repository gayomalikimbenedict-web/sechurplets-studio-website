import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

from server.http_utils import make_handler  # noqa: E402
from server.routes import receipt_get  # noqa: E402

handler = make_handler(get=receipt_get)
