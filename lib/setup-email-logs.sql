-- Crear tabla para registrar los envíos de correos
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear índice para búsquedas rápidas por email
CREATE INDEX IF NOT EXISTS email_logs_email_idx ON public.email_logs (email);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir inserciones desde el servidor
CREATE POLICY "Server can insert email logs"
  ON public.email_logs FOR INSERT
  TO authenticated, service_role
  USING (true);

-- Crear política para permitir lecturas desde el servidor
CREATE POLICY "Server can read email logs"
  ON public.email_logs FOR SELECT
  TO authenticated, service_role
  USING (true);

-- Otorgar permisos a roles anónimos y autenticados
GRANT SELECT, INSERT ON public.email_logs TO anon, authenticated, service_role;
