<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\SearchRequest as SearchRequestModel;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SearchRequestController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',

            'firstName' => 'required|string|max:100',
            'lastName' => 'required|string|max:100',
            'phone' => 'required|string|max:30',
            'email' => 'required|email',

            'birthDate' => 'nullable|date',
            'profession' => 'nullable|string|max:150',
            'country' => 'nullable|string|max:100',

            'bank' => 'nullable|string',

            'zone' => 'nullable|string',
            'otherZones' => 'nullable|string',
            'flexible' => 'nullable|boolean',

            'budget' => 'nullable|string',
            'customBudget' => 'nullable|numeric',

            'area' => 'nullable|string',
            'customArea' => 'nullable|numeric',

            'relief' => 'nullable|string',
            'usage' => 'nullable|string',

            'payment' => 'nullable|string',
            'duration' => 'nullable|string',
            'contribution' => 'nullable|numeric',

            'info' => 'nullable|string',
        ]);

        $number = 'REC-' .
            now()->format('ymd') .
            '-' .
            strtoupper(Str::random(4));

        $search = SearchRequestModel::create([
            'user_id' => $data['user_id'] ?? null,

            'request_number' => $number,

            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'],
            'phone' => $data['phone'],
            'email' => $data['email'],

            'birth_date' => $data['birthDate'] ?? null,
            'profession' => $data['profession'] ?? null,
            'country' => $data['country'] ?? 'Madagascar',

            'has_bank_account' =>
                ($data['bank'] ?? 'Non') === 'Oui',

            'zone' => $data['zone'] ?? null,
            'other_zones' => $data['otherZones'] ?? null,
            'flexible' => $data['flexible'] ?? true,

            'budget' => $data['budget'] ?? null,
            'custom_budget' => $data['customBudget'] ?? null,

            'area' => $data['area'] ?? null,
            'custom_area' => $data['customArea'] ?? null,

            'relief' => $data['relief'] ?? null,
            'usage' => $data['usage'] ?? null,

            'payment' => $data['payment'] ?? null,
            'duration' => $data['duration'] ?? null,
            'contribution' => $data['contribution'] ?? null,

            'info' => $data['info'] ?? null,

            'status' => 'pending',
        ]);

        if (!empty($data['user_id'])) {
            Notification::create([
                'user_id' => $data['user_id'],
                'type' => 'match',
                'title' => 'Recherche enregistrée',
                'text' =>
                    "Votre recherche {$number} a été enregistrée.",
                'unread' => true,
            ]);
        }

        return response()->json([
            'message' => 'Recherche enregistrée.',
            'request_number' => $number,
            'search' => $search,
        ], 201);
    }

    public function index(Request $request)
    {
        $query = SearchRequestModel::query();

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        return response()->json(
            $query->latest()->paginate(10)
        );
    }
}
