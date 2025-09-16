<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use Illuminate\Http\Request;
use App\Models\Position;
use Carbon\Carbon;

class PositionController extends Controller
{
    public function index()
    {
        return response()->json(Position::all());
    }

    public function store(Request $request)
    {
        /*
        $data = $request->validate
        ([
            'name' => 'required|unique:positions,name',
            'level' => 'required|integer',
            'description' => 'nullable|string'
        ]);
        */

        $data = [];
        $position = Position::create($data);
        return response()->json($position, 201);
    }

    public function show($id)
    {
        return response()->json(Position::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $position = Position::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|unique:positions,name,'.$id.',id_position',
            'level' => 'required|integer',
            'description' => 'nullable|string'
        ]);
        $position->update($data);
        return response()->json($position);
    }

    public function destroy($id)
    {
        $position = Position::findOrFail($id);
        $position->delete();
        return response()->json(null, 204);
    }
}
