import { 
  queryDatabase as _queryDatabase, 
  ensureDatabaseTables as _ensureDatabaseTables, 
  getApprovedSubmissions as _getApprovedSubmissions, 
  getAllSubmissions as _getAllSubmissions, 
  insertSubmission as _insertSubmission, 
  updateSubmissionStatus as _updateSubmissionStatus 
} from '@/DATABASES/db';

export async function queryDatabase(queryText: string, params: any[] = []): Promise<any[]> {
  return _queryDatabase(queryText, params);
}

export async function ensureDatabaseTables(): Promise<void> {
  return _ensureDatabaseTables();
}

export async function getApprovedSubmissions(): Promise<any[]> {
  return _getApprovedSubmissions();
}

export async function getAllSubmissions(): Promise<any[]> {
  return _getAllSubmissions();
}

export async function insertSubmission(data: {
  id: string;
  student_name: string;
  title: string;
  description: string;
  category: string;
  file_url: string | null;
  file_path: string | null;
}): Promise<any[]> {
  return _insertSubmission(data);
}

export async function updateSubmissionStatus(
  id: string,
  status: string,
  admin_note: string | null,
  reviewed_by?: string | null
): Promise<any[]> {
  return _updateSubmissionStatus(id, status, admin_note, reviewed_by || '');
}
