import 'server-only';
import { db } from '@/shared/lib/db';
import type { Client } from '@/types/types';

type GetClientsParams = {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
};

export async function getClients(params?: GetClientsParams): Promise<Client[]> {
  const clients = await db.getClients(params);

  return await Promise.all(
    clients.map(async (c) => {
      const contacts = await db.getContactsByClientId(c.client_id);
      const primary = contacts.find((con) => con.is_primary);

      return {
        clientId: c.client_id,
        companyName: c.company_name,
        legalName: c.legal_name,
        taxId: c.tax_id,
        website: c.website,
        industry: c.industry,
        isActive: c.is_active,
        archivedAt: c.archived_at,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        primaryContactName: primary
          ? `${primary.first_name} ${primary.last_name}`
          : null,
        primaryContactEmail: primary?.email ?? null,
        primaryContactPhone: primary?.phone ?? null,
      };
    })
  );
}
