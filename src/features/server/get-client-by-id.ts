import 'server-only';
import { db } from '@/shared/lib/db';
import type { ClientAddress, ClientDetails, ClientNote } from '@/types/types';

export async function getClientById(
  clientId: string
): Promise<ClientDetails | null> {
  const client = await db.getClientById(clientId);
  if (!client) return null;

  const [contacts, addresses, notesWithAuthors] = await Promise.all([
    db.getContactsByClientId(clientId),
    db.getAddressesByClientId(clientId),
    db.getNotesByClientId(clientId, 5),
  ]);

  const primary = contacts.find((c) => c.is_primary);

  const mappedAddresses: ClientAddress[] = addresses.map((a) => ({
    addressId: a.address_id,
    addressType: a.address_type,
    country: a.country,
    city: a.city,
    stateRegion: a.state_region,
    postalCode: a.postal_code,
    addressLine1: a.address_line_1,
    addressLine2: a.address_line_2,
  }));

  const mappedNotes: ClientNote[] = notesWithAuthors.map(
    ({ note, authorName }) => ({
      noteId: note.note_id,
      content: note.content,
      isInternal: note.is_internal,
      createdAt: note.created_at,
      authorFullName: authorName,
    })
  );

  return {
    clientId: client.client_id,
    companyName: client.company_name,
    legalName: client.legal_name,
    taxId: client.tax_id,
    website: client.website,
    industry: client.industry,
    description: client.description,
    isActive: client.is_active,
    archivedAt: client.archived_at,
    createdAt: client.created_at,
    updatedAt: client.updated_at,
    managerId: client.manager_id,
    primaryContactName: primary
      ? `${primary.first_name} ${primary.last_name}`
      : null,
    primaryContactEmail: primary?.email ?? null,
    primaryContactPhone: primary?.phone ?? null,
    addresses: mappedAddresses,
    notes: mappedNotes,
  };
}
