import { ZodError } from 'zod';
import multer from 'multer';
import { AppError } from '../utils/AppError.js';

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'erro_validacao',
      mensagem: 'Dados inválidos enviados na requisição.',
      erros: err.errors.map((e) => ({
        campo: e.path.join('.'),
        mensagem: e.message,
      })),
    });
  }

  if (err instanceof multer.MulterError) {
    const mensagensMulter = {
      LIMIT_FILE_SIZE: 'Cada fotografia deve ter no máximo 5 MB.',
      LIMIT_FILE_COUNT: 'Você pode enviar no máximo 15 fotografias por vez.',
      LIMIT_UNEXPECTED_FILE: 'Campo de envio de arquivos inválido. Utilize o campo "fotos".',
    };
    return res.status(400).json({
      status: 'erro_upload',
      mensagem: mensagensMulter[err.code] || 'Erro ao processar o envio das fotografias.',
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'erro',
      mensagem: err.message,
      ...(err.details ? { detalhes: err.details } : {}),
    });
  }

  console.error('Erro interno não tratado:', err);
  return res.status(500).json({
    status: 'erro_interno',
    mensagem: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
  });
}