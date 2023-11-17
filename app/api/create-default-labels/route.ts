import { NextResponse } from 'next/server';
import { prismaClient } from '@/app/api/utils';

// TODO: this endpoint is for creating the default labels at first
export async function GET() {
  const labels = [
    { id: 'clp1kczq30001u8uhpnygvod5', text: 'Label1', color: '#fd9000' },
    { id: 'clp1kczq70002u8uh4txo5r80', text: 'Label2', color: '#fe0000' },
    { id: 'clp1kczq90003u8uhzw6t713r', text: 'Label3', color: '#7a1fa2' },
    { id: 'clp1kczqb0004u8uh2eafoqr0', text: 'Label4', color: '#1260fe' },
    { id: 'clp1kczqd0005u8uhxp2s1yld', text: 'Label5', color: '#25b651' },
  ];

  const currentLabels = await prismaClient.label.findMany();

  await Promise.all(
    labels
      .filter(({ id }) => currentLabels.find((item) => item.id === id) === undefined)
      .map(async (label) => {
        await prismaClient.label.create({ data: { id: label.id, text: label.text, color: label.color } });
      }),
  );
  return NextResponse.json({ response: `labels are created` }, { status: 200 });
}
