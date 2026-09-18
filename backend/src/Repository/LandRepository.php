<?php

namespace App\Repository;

use App\Entity\Land;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Land>
 */
class LandRepository extends ServiceEntityRepository
{
    private const USAGE_KEYWORDS = [
        'residentiel' => ['résidentiel', 'résidence', 'villa', 'famille'],
        'agricole' => ['agricole', 'agriculture', 'fertile', 'culture'],
        'commercial' => ['commercial', 'commerce', 'boutique'],
        'touristique' => ['touristique', 'tourisme', 'hôtelier', 'plage', 'vue mer', 'bord de mer'],
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Land::class);
    }

    /**
     * @return Land[]
     */
    public function search(
        ?string $query,
        ?string $region,
        ?int $maxPrice,
        ?int $minArea,
        ?string $usage = null,
        ?string $titleStatus = null,
    ): array {
        $qb = $this->createQueryBuilder('l')->orderBy('l.createdAt', 'DESC');

        if ($query) {
            $qb->andWhere('LOWER(l.title) LIKE :q OR LOWER(l.location) LIKE :q')
                ->setParameter('q', '%' . mb_strtolower($query) . '%');
        }

        if ($region) {
            $qb->andWhere('l.region = :region')->setParameter('region', $region);
        }

        if ($maxPrice !== null) {
            $qb->andWhere('l.price <= :maxPrice')->setParameter('maxPrice', $maxPrice);
        }

        if ($minArea !== null) {
            $qb->andWhere('l.area >= :minArea')->setParameter('minArea', $minArea);
        }

        if ($titleStatus) {
            $qb->andWhere('l.titleStatus = :titleStatus')->setParameter('titleStatus', $titleStatus);
        }

        if ($usage && isset(self::USAGE_KEYWORDS[$usage])) {
            $orX = $qb->expr()->orX();
            foreach (self::USAGE_KEYWORDS[$usage] as $i => $keyword) {
                $param = 'usage' . $i;
                $orX->add($qb->expr()->like('LOWER(l.title)', ':' . $param));
                $orX->add($qb->expr()->like('LOWER(l.description)', ':' . $param));
                $qb->setParameter($param, '%' . mb_strtolower($keyword) . '%');
            }
            $qb->andWhere($orX);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * @return string[]
     */
    public function findDistinctRegions(): array
    {
        $rows = $this->createQueryBuilder('l')
            ->select('DISTINCT l.region')
            ->orderBy('l.region', 'ASC')
            ->getQuery()
            ->getScalarResult();

        return array_column($rows, 'region');
    }
}
