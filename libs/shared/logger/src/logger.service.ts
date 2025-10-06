import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class LoggerService {
  private readonly logsDir = path.join(__dirname, '..', 'logs');

  async getLogs(date: string) {
    const targetDate = date || new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const fileName = `requests-${targetDate}.log`;
    const filePath = path.join(this.logsDir, fileName);

    console.log('filePath', filePath);

    await fs.access(filePath).catch(() => {
      throw new NotFoundException(`Log file for ${targetDate} not found`);
    });

    const content = await fs.readFile(filePath, 'utf-8');

    const lines = content
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return { raw: line };
        }
      });

    return { date: targetDate, count: lines.length, entries: lines };
  }
}
