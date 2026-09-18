<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260918111550 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE reservation ADD COLUMN profession VARCHAR(150) DEFAULT NULL');
        $this->addSql('ALTER TABLE reservation ADD COLUMN bank_account VARCHAR(100) DEFAULT NULL');
        $this->addSql('ALTER TABLE reservation ADD COLUMN age INTEGER DEFAULT NULL');
        $this->addSql('ALTER TABLE reservation ADD COLUMN nationality VARCHAR(100) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__reservation AS SELECT id, project_name, full_name, phone, email, budget, message, status, created_at, land_id FROM reservation');
        $this->addSql('DROP TABLE reservation');
        $this->addSql('CREATE TABLE reservation (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, project_name VARCHAR(255) DEFAULT NULL, full_name VARCHAR(255) NOT NULL, phone VARCHAR(50) NOT NULL, email VARCHAR(255) DEFAULT NULL, budget VARCHAR(100) DEFAULT NULL, message CLOB DEFAULT NULL, status VARCHAR(20) NOT NULL, created_at DATETIME NOT NULL, land_id INTEGER DEFAULT NULL, CONSTRAINT FK_42C849551994904A FOREIGN KEY (land_id) REFERENCES land (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO reservation (id, project_name, full_name, phone, email, budget, message, status, created_at, land_id) SELECT id, project_name, full_name, phone, email, budget, message, status, created_at, land_id FROM __temp__reservation');
        $this->addSql('DROP TABLE __temp__reservation');
        $this->addSql('CREATE INDEX IDX_42C849551994904A ON reservation (land_id)');
    }
}
