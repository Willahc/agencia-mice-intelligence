# Auditoria de Compatibilidade com ChatGPT Sites

## Resumo
- Arquivos analisados com problemas: **22**

### public\app.js
- **localhost**: Hard‑coded localhost reference

### scripts\audit-project.js
- **localhost**: Hard‑coded localhost reference
- **fs**: File‑system calls: readFileSync, writeFileSync, fs.readdirSync, fs.readFileSync, appendFileSync, unlinkSync, mkdirSync, readdirSync, fs.mkdirSync, fs.writeFileSync

### scripts\generate-swagger.js
- **localhost**: Hard‑coded localhost reference
- **fs**: File‑system calls: fs.writeFileSync

### scripts\populate_database.js
- **fs**: File‑system calls: fs.readFileSync, fs.writeFileSync

### scripts\populate_medium_events.js
- **fs**: File‑system calls: fs.readFileSync, fs.writeFileSync

### scripts\populate_regional_suppliers.js
- **fs**: File‑system calls: fs.readFileSync, fs.writeFileSync

### scripts\populate_shows_and_festivals.js
- **fs**: File‑system calls: fs.readFileSync, fs.writeFileSync

### scripts\populate_state_agro.js
- **fs**: File‑system calls: fs.readFileSync, fs.writeFileSync

### scripts\swaggerSpec.json
- **localhost**: Hard‑coded localhost reference

### server.js
- **localhost**: Hard‑coded localhost reference
- **fs**: File‑system calls: fs.readFileSync

### src\engine\agentsEngine.js
- **localhost**: Hard‑coded localhost reference
- **fs**: File‑system calls: fs.readFileSync

### src\engine\demandOrchestrator.js
- **fs**: File‑system calls: fs.readFileSync

### src\engine\miceEngine.js
- **fs**: File‑system calls: fs.readFileSync

### src\logger.js
- **fs**: File‑system calls: fs.mkdirSync

### src\modules\dealPipeline.js
- **fs**: File‑system calls: fs.writeFileSync, fs.readFileSync

### src\modules\eventScraper.js
- **fs**: File‑system calls: fs.writeFileSync, fs.readFileSync

### src\modules\leadEnricher.js
- **localhost**: Hard‑coded localhost reference

### src\modules\progressReportGenerator.js
- **localhost**: Hard‑coded localhost reference

### src\modules\radarCollector.js
- **fs**: File‑system calls: fs.readdirSync, fs.readFileSync, fs.writeFileSync

### src\modules\supplierManager.js
- **fs**: File‑system calls: fs.writeFileSync, fs.readFileSync

### src\routes\api.js
- **express**: Express import detected

### src\server.js
- **localhost**: Hard‑coded localhost reference
- **express**: Express import detected

