import path from 'path';
import crypto from 'crypto';
import { supabase, STORAGE_BUCKET } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';

export const storageService = {
  async uploadImagemImovel(imovelId, file) {
    const extensao = path.extname(file.originalname).toLowerCase() || '.jpg';
    const nomeUnico = `${crypto.randomUUID()}${extensao}`;
    const storageKey = `imoveis/${imovelId}/${nomeUnico}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storageKey, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Erro no upload para o Supabase Storage:', error);
      throw new AppError('Falha ao enviar fotografia para o armazenamento.', 502);
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storageKey);

    return {
      url: publicUrlData.publicUrl,
      storageKey,
    };
  },

  async removerImagemImovel(storageKey) {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([storageKey]);
    if (error) {
      console.error('Aviso: falha ao remover arquivo físico no Supabase Storage:', error);
    }
  },
};