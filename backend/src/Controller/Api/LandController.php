<?php

namespace App\Controller\Api;

use App\Repository\LandRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class LandController
{
    #[Route('/lands', name: 'api_lands_list', methods: ['GET'])]
    public function list(Request $request, LandRepository $lands): JsonResponse
    {
        $query = $request->query->get('q');
        $region = $request->query->get('region');
        $maxPrice = $request->query->has('maxPrice') ? (int) $request->query->get('maxPrice') : null;
        $minArea = $request->query->has('minArea') ? (int) $request->query->get('minArea') : null;
        $usage = $request->query->get('usage');
        $titleStatus = $request->query->get('titleStatus');

        $results = $lands->search($query ?: null, $region ?: null, $maxPrice, $minArea, $usage ?: null, $titleStatus ?: null);

        return new JsonResponse(array_map(fn($land) => $land->toArray(), $results));
    }

    #[Route('/lands/{id}', name: 'api_lands_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(int $id, LandRepository $lands): JsonResponse
    {
        $land = $lands->find($id);
        if (!$land) {
            return new JsonResponse(['error' => 'Terrain introuvable.'], 404);
        }

        return new JsonResponse($land->toArray());
    }

    #[Route('/regions', name: 'api_regions_list', methods: ['GET'])]
    public function regions(LandRepository $lands): JsonResponse
    {
        return new JsonResponse($lands->findDistinctRegions());
    }
}
