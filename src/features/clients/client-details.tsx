import type { ClientDetails } from '@/types/types';

type ClientDetailsProps = {
  client: ClientDetails;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

function getAddressTypeLabel(type: 'legal' | 'billing' | 'shipping' | 'office') {
  switch (type) {
    case 'legal':
      return 'Юридический';
    case 'billing':
      return 'Платёжный';
    case 'shipping':
      return 'Доставка';
    case 'office':
      return 'Офис';
    default:
      return type;
  }
}

export function ClientDetailsCard({ client }: ClientDetailsProps) {
  return (
    <div className="client-details">
      <div className="details-grid">
        <section className="details-card">
          <p className="section-eyebrow">Client overview</p>
          <h2 className="section-title">{client.companyName}</h2>

          <div className="details-list">
            <div className="details-list__item">
              <span className="details-list__label">ID</span>
              <span className="details-list__value">{client.clientId}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Юридическое имя</span>
              <span className="details-list__value">{client.legalName ?? '—'}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Tax ID</span>
              <span className="details-list__value">{client.taxId ?? '—'}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Индустрия</span>
              <span className="details-list__value">{client.industry ?? '—'}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Website</span>
              <span className="details-list__value">
                {client.website ? (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    {client.website}
                  </a>
                ) : (
                  '—'
                )}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Статус</span>
              <span className="details-list__value">
                {client.isActive ? 'active' : 'inactive'}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Создан</span>
              <span className="details-list__value">{formatDate(client.createdAt)}</span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Обновлён</span>
              <span className="details-list__value">{formatDate(client.updatedAt)}</span>
            </div>
          </div>

          <div className="details-description">
            <h3 className="details-subtitle">Описание</h3>
            <p>{client.description ?? 'Описание отсутствует.'}</p>
          </div>
        </section>

        <section className="details-card">
          <p className="section-eyebrow">Primary contact</p>
          <h2 className="section-title">Основной контакт</h2>

          <div className="details-list">
            <div className="details-list__item">
              <span className="details-list__label">Имя</span>
              <span className="details-list__value">
                {client.primaryContactName ?? '—'}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Email</span>
              <span className="details-list__value">
                {client.primaryContactEmail ?? '—'}
              </span>
            </div>

            <div className="details-list__item">
              <span className="details-list__label">Телефон</span>
              <span className="details-list__value">
                {client.primaryContactPhone ?? '—'}
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="details-card">
        <p className="section-eyebrow">Addresses</p>
        <h2 className="section-title">Адреса</h2>

        {client.addresses.length === 0 ? (
          <p className="empty-inline">Адреса не найдены.</p>
        ) : (
          <div className="details-blocks">
            {client.addresses.map((address) => (
              <div key={address.addressId} className="details-block">
                <div className="details-block__header">
                  <strong>{getAddressTypeLabel(address.addressType)}</strong>
                </div>

                <div className="details-block__content">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 ? <p>{address.addressLine2}</p> : null}
                  <p>
                    {address.city ?? '—'}
                    {address.stateRegion ? `, ${address.stateRegion}` : ''}
                  </p>
                  <p>
                    {address.country ?? '—'}
                    {address.postalCode ? `, ${address.postalCode}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="details-card">
        <p className="section-eyebrow">Recent notes</p>
        <h2 className="section-title">Последние заметки</h2>

        {client.notes.length === 0 ? (
          <p className="empty-inline">Заметки отсутствуют.</p>
        ) : (
          <div className="notes-list">
            {client.notes.map((note) => (
              <article key={note.noteId} className="note-card">
                <div className="note-card__meta">
                  <span>{note.authorFullName}</span>
                  <span>{formatDate(note.createdAt)}</span>
                  <span>{note.isInternal ? 'internal' : 'public'}</span>
                </div>

                <p className="note-card__content">{note.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
