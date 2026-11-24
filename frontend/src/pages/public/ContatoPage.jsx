import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { EMPRESA_CONFIG } from '../../config/empresa';

export function ContatoPage() {

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '3rem 1.25rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
          Canais de Atendimento
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Entre em contato com a {EMPRESA_CONFIG.razaoSocial} para tirar dúvidas ou agendar uma visita.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card">
          <Phone size={22} color="var(--color-primary)" style={{ marginBottom: '0.6rem' }} />
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Telefone</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
            Fixo: {EMPRESA_CONFIG.telefoneExibicao}
          </p>
        </div>

        <div className="card">
          <Mail size={22} color="var(--color-primary)" style={{ marginBottom: '0.6rem' }} />
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>E-mail</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
            {EMPRESA_CONFIG.emailContato}
          </p>
        </div>

        <div className="card">
          <Clock size={22} color="var(--color-primary)" style={{ marginBottom: '0.6rem' }} />
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Horário de Atendimento</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
            {EMPRESA_CONFIG.horarioAtendimento}
          </p>
        </div>

        <div className="card">
          <MapPin size={22} color="var(--color-primary)" style={{ marginBottom: '0.6rem' }} />
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Localização</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
            {EMPRESA_CONFIG.endereco}
          </p>
        </div>
      </div>
    </div>
  );
}