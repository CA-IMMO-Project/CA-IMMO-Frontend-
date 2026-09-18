<?php

namespace App\Controller\Api;

use App\Entity\ContactMessage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class ContactController
{
    #[Route('/contact', name: 'api_contact_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $errors = [];
        $firstName = trim((string) ($data['firstName'] ?? ''));
        $lastName = trim((string) ($data['lastName'] ?? ''));
        $phone = trim((string) ($data['phone'] ?? ''));
        $message = trim((string) ($data['message'] ?? ''));

        if ($firstName === '') {
            $errors['firstName'] = 'Le prénom est requis.';
        }
        if ($lastName === '') {
            $errors['lastName'] = 'Le nom est requis.';
        }
        if ($phone === '') {
            $errors['phone'] = 'Le téléphone est requis.';
        }
        if ($message === '') {
            $errors['message'] = 'Le message est requis.';
        }

        if ($errors) {
            return new JsonResponse(['errors' => $errors], 422);
        }

        $contactMessage = new ContactMessage();
        $contactMessage->setFirstName($firstName);
        $contactMessage->setLastName($lastName);
        $contactMessage->setPhone($phone);
        $contactMessage->setEmail(!empty($data['email']) ? (string) $data['email'] : null);
        $contactMessage->setSubject(!empty($data['subject']) ? (string) $data['subject'] : 'Autre demande');
        $contactMessage->setMessage($message);

        $em->persist($contactMessage);
        $em->flush();

        return new JsonResponse($contactMessage->toArray(), 201);
    }
}
