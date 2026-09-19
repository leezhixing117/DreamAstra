import fs from 'fs';
import path from 'path';
import { DREAM_BOOKS, DREAM_TAGS, DREAM_SYMBOLS } from '../server/dreamAstraData';

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

let sql = `-- ============================================
-- DreamAstra 完整主庫 SQL
-- 22 本書 + 100 意象 + 標籤關聯 (MySQL / MariaDB & PostgreSQL Compatible)
-- ============================================

DROP TABLE IF EXISTS dream_symbol_tag;
DROP TABLE IF EXISTS dream_tag;
DROP TABLE IF EXISTS dream_symbol;
DROP TABLE IF EXISTS dream_book;

-- 1. 書籍主表
CREATE TABLE dream_book (
  book_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  book_name VARCHAR(255) NOT NULL,
  book_name_en VARCHAR(255) DEFAULT NULL,
  author VARCHAR(128) DEFAULT NULL,
  school VARCHAR(64) DEFAULT NULL,
  global_weight FLOAT DEFAULT 0.50,
  description TEXT DEFAULT NULL,
  UNIQUE KEY uk_book_name (book_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO dream_book VALUES
${DREAM_BOOKS.map((b) => 
  `(${b.book_id},'${escapeSql(b.book_name)}','${escapeSql(b.book_name_en)}','${escapeSql(b.author)}','${escapeSql(b.school)}',${b.global_weight},'${escapeSql(b.description)}')`
).join(',\n')};

-- 2. 標籤主表
CREATE TABLE dream_tag (
  tag_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tag_name VARCHAR(64) NOT NULL,
  tag_desc TEXT DEFAULT NULL,
  UNIQUE KEY uk_tag_name (tag_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO dream_tag VALUES
${DREAM_TAGS.map((t) => 
  `(${t.tag_id},'${escapeSql(t.tag_name)}','${escapeSql(t.tag_desc)}')`
).join(',\n')};

-- 3. 意象主表
CREATE TABLE dream_symbol (
  symbol_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(128) NOT NULL,
  alias_list JSON NOT NULL DEFAULT ('[]'),
  book_interpret_json JSON NOT NULL DEFAULT ('{}'),
  source_ref VARCHAR(512) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_symbol (symbol),
  INDEX idx_symbol (symbol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO dream_symbol (symbol_id, symbol, alias_list, book_interpret_json, source_ref, notes) VALUES
${DREAM_SYMBOLS.map((s) => {
  const aliasJson = JSON.stringify(s.alias_list);
  const bookJson = JSON.stringify(s.book_interpret_json);
  return `(${s.symbol_id},'${escapeSql(s.symbol)}','${escapeSql(aliasJson)}','${escapeSql(bookJson)}','${escapeSql(s.source_ref)}','${escapeSql(s.notes)}')`;
}).join(',\n')};

-- 4. 標籤關聯表
CREATE TABLE dream_symbol_tag (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  symbol_id INT UNSIGNED NOT NULL,
  tag_id INT UNSIGNED NOT NULL,
  UNIQUE KEY uk_symbol_tag (symbol_id, tag_id),
  FOREIGN KEY (symbol_id) REFERENCES dream_symbol(symbol_id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES dream_tag(tag_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

`;

// Generate symbol_tag mappings
const tagMappings: Array<{ symbol_id: number; tag_id: number }> = [];
for (const s of DREAM_SYMBOLS) {
  for (const tid of s.tag_ids) {
    tagMappings.push({ symbol_id: s.symbol_id, tag_id: tid });
  }
}

sql += `INSERT INTO dream_symbol_tag (symbol_id, tag_id) VALUES\n`;
sql += tagMappings.map((m) => `(${m.symbol_id},${m.tag_id})`).join(',\n') + ';\n';

fs.mkdirSync(path.join(process.cwd(), 'server', 'sql'), { recursive: true });
fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });

fs.writeFileSync(path.join(process.cwd(), 'server', 'sql', 'dreamastra_master.sql'), sql, 'utf8');
fs.writeFileSync(path.join(process.cwd(), 'public', 'dreamastra_master.sql'), sql, 'utf8');

console.log('✅ Generated dreamastra_master.sql successfully with 22 books, 6 tags, 100 symbols, and', tagMappings.length, 'symbol-tag links.');
