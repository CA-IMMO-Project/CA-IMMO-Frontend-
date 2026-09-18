<?php

namespace App\Controller\Api;

use App\Entity\Reservation;
use App\Repository\LandRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class ReservationController
{
    #[Route('/reservations', name: 'api_reservations_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, LandRepository $lands): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $errors = [];
        $fullName = trim((string) ($data['fullName'] ?? ''));
        $phone = trim((string) ($data['phone'] ?? ''));

        if ($fullName === '') {
            $errors['fullName'] = 'Le nom complet est requis.';
        }
        if ($phone === '') {
            $errors['phone'] = 'Le téléphone est requis.';
        }

        if ($errors) {
            return new JsonResponse(['errors' => $errors], 422);
        }

        $reservation = new Reservation();
        $reservation->setFullName($fullName);
        $reservation->setPhone($phone);
        $reservation->setEmail(!empty($data['email']) ? (string) $data['email'] : null);
        $reservation->setBudget(!empty($data['budget']) ? (string) $data['budget'] : null);
        $reservation->setProfession(!empty($data['profession']) ? (string) $data['profession'] : null);
        $reservation->setBankAccount(!empty($data['bankAccount']) ? (string) $data['bankAccount'] : null);
        $reservation->setAge(!empty($data['age']) ? (int) $data['age'] : null);
        $reservation->setNationality(!empty($data['nationality']) ? (string) $data['nationality'] : null);
        $reservation->setMessage(!empty($data['message']) ? (string) $data['message'] : null);
        $reservation->setProjectName(!empty($data['projectName']) ? (string) $data['projectName'] : null);

        if (!empty($data['landId'])) {
            $land = $lands->find((int) $data['landId']);
            if (!$land) {
                return new JsonResponse(['errors' => ['landId' => 'Terrain introuvable.']], 422);
            }
            $reservation->setLand($land);
        }

        $em->persist($reservation);
        $em->flush();

        return new JsonResponse($reservation->toArray(), 201);
    }
}
