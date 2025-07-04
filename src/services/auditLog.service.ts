import fs from 'fs';
import path from 'path';

const AUDIT_LOG_PATH = path.resolve(__dirname, '../../logs/businessRuleAudit.log');

export interface AuditLogEntry {
  timestamp: string;
  adminId: string;
  action: string;
  entity: string;
  rule: string;
  oldValue: any;
  newValue: any;
  ip?: string;
}

export class AuditLogService {
  static async log(entry: AuditLogEntry) {
    const logLine = JSON.stringify(entry) + '\n';
    await fs.promises.appendFile(AUDIT_LOG_PATH, logLine, 'utf8');
  }
}

export default AuditLogService;
