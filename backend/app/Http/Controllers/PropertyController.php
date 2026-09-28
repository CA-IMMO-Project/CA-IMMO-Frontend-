<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with([
            'media',
            'documents'
        ])
        ->where('status', 'published')
        ->where('available', true);

        if ($request->filled('zone')) {
            $query->where(function ($q) use ($request) {
                $q->where('region', 'ILIKE', '%' . $request->zone . '%')
                  ->orWhere('district', 'ILIKE', '%' . $request->zone . '%')
                  ->orWhere('commune', 'ILIKE', '%' . $request->zone . '%')
                  ->orWhere('fokontany', 'ILIKE', '%' . $request->zone . '%');
            });
        }

        if ($request->filled('minPrice')) {
            $query->where('price', '>=', $request->minPrice);
        }

        if ($request->filled('maxPrice')) {
            $query->where('price', '<=', $request->maxPrice);
        }

        if ($request->filled('minArea')) {
            $query->where('area', '>=', $request->minArea);
        }

        if ($request->filled('maxArea')) {
            $query->where('area', '<=', $request->maxArea);
        }

        if ($request->filled('maxSqm')) {
            $query->where('price_per_sqm', '<=', $request->maxSqm);
        }

        if ($request->filled('relief')) {
            $query->where('relief', $request->relief);
        }

        if ($request->filled('payment')) {
            $query->where('payment', 'ILIKE', '%' . $request->payment . '%');
        }

        if ($request->filled('verified')) {
            $query->where('verified', filter_var(
                $request->verified,
                FILTER_VALIDATE_BOOLEAN
            ));
        }

        switch ($request->get('sort')) {
            case 'priceAsc':
                $query->orderBy('price', 'asc');
                break;

            case 'priceDesc':
                $query->orderBy('price', 'desc');
                break;

            case 'area':
                $query->orderBy('area', 'desc');
                break;

            default:
                $query->latest();
        }

        return response()->json(
            $query->paginate(12)
        );
    }

    public function show(Property $property)
    {
        $property->load([
            'owner',
            'media',
            'documents'
        ]);

        return response()->json($property);
    }

    public function related(Property $property)
    {
        $properties = Property::where('id', '!=', $property->id)
            ->where('status', 'published')
            ->where('available', true)
            ->where(function ($query) use ($property) {
                $query->where('commune', $property->commune)
                      ->orWhere('region', $property->region);
            })
            ->latest()
            ->limit(3)
            ->get();

        return response()->json($properties);
    }
}
