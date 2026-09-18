<?php

namespace App\Entity;

use App\Repository\LandRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LandRepository::class)]
#[ORM\Table(name: 'land')]
class Land
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $title = '';

    #[ORM\Column(type: Types::TEXT)]
    private string $description = '';

    #[ORM\Column]
    private int $price = 0;

    #[ORM\Column(length: 100)]
    private string $region = '';

    #[ORM\Column(length: 255)]
    private string $location = '';

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $latitude = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $longitude = null;

    #[ORM\Column(length: 500)]
    private string $imageUrl = '';

    #[ORM\Column(type: Types::JSON)]
    private array $features = [];

    #[ORM\Column]
    private int $area = 0;

    #[ORM\Column(length: 50)]
    private string $titleStatus = 'Titre en cours';

    #[ORM\Column(length: 20)]
    private string $status = 'disponible';

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getPrice(): int
    {
        return $this->price;
    }

    public function setPrice(int $price): static
    {
        $this->price = $price;
        return $this;
    }

    public function getRegion(): string
    {
        return $this->region;
    }

    public function setRegion(string $region): static
    {
        $this->region = $region;
        return $this;
    }

    public function getLocation(): string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;
        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(?float $latitude): static
    {
        $this->latitude = $latitude;
        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(?float $longitude): static
    {
        $this->longitude = $longitude;
        return $this;
    }

    public function getImageUrl(): string
    {
        return $this->imageUrl;
    }

    public function setImageUrl(string $imageUrl): static
    {
        $this->imageUrl = $imageUrl;
        return $this;
    }

    public function getFeatures(): array
    {
        return $this->features;
    }

    public function setFeatures(array $features): static
    {
        $this->features = $features;
        return $this;
    }

    public function getArea(): int
    {
        return $this->area;
    }

    public function setArea(int $area): static
    {
        $this->area = $area;
        return $this;
    }

    public function getTitleStatus(): string
    {
        return $this->titleStatus;
    }

    public function setTitleStatus(string $titleStatus): static
    {
        $this->titleStatus = $titleStatus;
        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function toArray(): array
    {
        $coordinates = null;
        if ($this->latitude !== null && $this->longitude !== null) {
            $coordinates = [$this->latitude, $this->longitude];
        }

        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'region' => $this->region,
            'location' => $this->location,
            'coordinates' => $coordinates,
            'imageUrl' => $this->imageUrl,
            'features' => $this->features,
            'area' => $this->area,
            'titleStatus' => $this->titleStatus,
            'status' => $this->status,
        ];
    }
}
