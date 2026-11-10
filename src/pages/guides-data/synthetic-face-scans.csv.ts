import { scansCsv } from '../../lib/experiments';

export const GET = () => new Response(scansCsv(), { headers: { 'content-type': 'text/csv; charset=utf-8' } });
