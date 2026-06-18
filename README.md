# SIGEU - Sistema de Gestión de Espacios Universitarios

Plataforma web para la reserva de aulas, laboratorios y auditorios de la Universidad Francisco de Paula Santander Ocaña.

## Tecnologías

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python, SQLAlchemy
- **Base de datos:** PostgreSQL (Supabase)
- **IA:** YOLOv8 nano (Ultralytics) + OpenCV
- **Emails:** fastapi-mail + Gmail SMTP

## Funcionalidades

- Registro e inicio de sesión con roles (Estudiante, Docente, Administrador)
- Reserva de espacios con validación de disponibilidad y horarios
- Panel de administración con gestión de reservas y usuarios
- Control de aforo en tiempo real con detección de personas (YOLO)
- Streaming de video desde cámara al dashboard del administrador
- Notificaciones por email (confirmación, cancelación, recuperación de contraseña)
- Modo oscuro/claro
- Accesibilidad ARIA

## Requisitos previos

- Node.js 18+
- Python 3.12+
- PostgreSQL (Supabase)
- Cámara web (para el módulo de aforo)

## Instalación

### Frontend

```bash
git clone https://github.com/kdmaniosy/SIGEU.git
cd SIGEU
npm install
npm run dev
```

### Backend

```bash
git clone https://github.com/kdmaniosy/sigeu-backend.git
cd sigeu-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Variables de entorno

### Backend — archivo `.env`

```env
DATABASE_URL=postgresql://...
SECRET_KEY=tu_clave_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
MAIL_USERNAME=tucorreo@gmail.com
MAIL_PASSWORD=xxxxxxxxxxxx
MAIL_FROM=tucorreo@gmail.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
```

### Frontend — archivo `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Uso

1. Inicia el backend: `uvicorn app.main:app --reload`
2. Inicia el frontend: `npm run dev`
3. Abre `http://localhost:3000`
4. Para el módulo de aforo: `python aforo_detector.py`

## Estructura del proyecto