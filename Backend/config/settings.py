"""
Django settings del taller Taller Django + React (SECOP II).

DIA 1 - Mini 1 · "La Boveda"
TODAS las credenciales (llave secreta, base de datos) viven en el
archivo .env y NUNCA en el codigo. La libreria python-dotenv las carga
en variables de entorno al arrancar; si falta alguna, el proyecto se
detiene con un mensaje claro (mejor que un traceback criptico).

Fuente de verdad del taller:
  Backend/.env          -> valores reales de la maquina (NO sube a git)
  Backend/.env.example  -> plantilla de instrucciones para el estudiante
"""

import sys
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Carga el .env que vive junto a manage.py. El archivo .env.example es
# la plantilla que copia el estudiante en el Mini 1; este modulo solo
# sabe leer variables de entorno y NO contiene credenciales.
load_dotenv(BASE_DIR / '.env')

import os


def _variable_obligatoria(nombre, ayuda):
    """
    Lee una variable de entorno obligatoria. Si falta, corta el arranque
    con las instrucciones del taller en la terminal (didactico, no un
    traceback criptico).
    """
    valor = os.getenv(nombre)
    if not valor:
        print(
            f'\nX Falta la variable {nombre} en el archivo Backend/.env\n'
            f'  {ayuda}\n'
            '  Copia Backend/.env.example a Backend/.env y completala.\n'
        )
        sys.exit(1)
    return valor


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.1/howto/deployment/checklist/

# Convierte el texto del .env ('true'/'false') en booleano de verdad.
def _variable_booleana(nombre):
    valor = _variable_obligatoria(
        nombre, "'true' en desarrollo local, 'false' en producción."
    )
    return valor.strip().lower() in ('1', 'true', 'si', 'sí')


SECRET_KEY = _variable_obligatoria(
    'SECRET_KEY',
    'Es la llave de seguridad de Django. Genera una nueva en la terminal:\n'
    '  python manage.py shell -c "from django.core.management.utils import '
    'get_random_secret_key; print(get_random_secret_key())"',
)

DEBUG = _variable_booleana('DEBUG')

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'contratos',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ==============================================================================
# TODO (RETO 9) - Mini 9 · El Portero: abrir la puerta CORS
# ==============================================================================
#
# ⏸ INSTRUCTORES (Steven/Yesid): El Impulso (Mini 8) fallara CON RAZON en
#    este punto: dos origenes (5173 y 8000) y el navegador la bloquea.
#    Al terminar la demo del preflight (OPTIONS), el estudiante descomenta:
#
#  1. En INSTALLED_APPS de arriba agrega:    'corsheaders'
#  2. En MIDDLEWARE agrega ANTES de CommonMiddleware:
#         'corsheaders.middleware.CorsMiddleware'
#  3. Y al final del bloque agrega la lista de origenes autorizados:
#         CORS_ALLOWED_ORIGINS = [
#             'http://localhost:5173',
#             'http://127.0.0.1:5173',
#         ]
#
# Con eso el Mini 9 queda Aprobado y el Mini 10 (El Render) re-revisa
# el flujo en vivo. La app `corsheaders` ya viene instalada en
# requirements.txt: solo hace falta conectarla.
# ==============================================================================

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/6.1/ref/settings/#databases
# Mini 1 · La Boveda: los 5 datos de conexion VIVEN en el .env.
# SQLite esta PROHIBIDO en este taller (criterio de rechazo #1).
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': _variable_obligatoria(
            'DB_NAME', 'Nombre de la base de datos en PostgreSQL 18.'
        ),
        'USER': _variable_obligatoria(
            'DB_USER', 'Usuario de PostgreSQL (normalmente postgres).'
        ),
        'PASSWORD': _variable_obligatoria(
            'DB_PASSWORD', 'Tu clave local de PostgreSQL; nunca en el codigo.'
        ),
        'HOST': _variable_obligatoria('DB_HOST', 'localhost en desarrollo.'),
        'PORT': _variable_obligatoria('DB_PORT', '5432 por defecto.'),
    },
}


# Password validation
# https://docs.djangoproject.com/en/6.1/topics/i18n/

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization

LANGUAGE_CODE = 'es'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.1/topics/static-files/

STATIC_URL = 'static/'


# ==============================================================================
# TODO (RETO 14) - Mini 14 · El Regulador: paginacion global
# ==============================================================================
#
# ⏸ INSTRUCTORES (Steven/Yesid): MUY pronto el dataset tendra 50.000
#    registros, y sin paginacion ese JSON aplasta la red y el frontend.
#    El estudiante descomenta este bloque y refresca la misión 3.4:
#
# REST_FRAMEWORK = {
#     'DEFAULT_PAGINATION_CLASS':
#         'rest_framework.pagination.PageNumberPagination',
#     'PAGE_SIZE': 50,
# }
#
# Con eso TODA la API (el ModelViewSet del RETO 5) responde
# {count, next, previous, results} en vez del listado completo.
# ==============================================================================
