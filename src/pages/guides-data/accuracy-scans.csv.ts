import { accuracyCsv } from '../../lib/accuracy';

export const GET = () => new Response(accuracyCsv(), { headers: { 'content-type': 'text/csv; charset=utf-8' } });
