<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use Illuminate\Http\Request;
use App\Models\Project;
use Carbon\Carbon;

class ProjectController extends Controller
{
    public function index()
    {
        return response()->json(Project::with('employees')->get());
    }

    public function store(Request $request)
    {
        /*
        $data = $request->validate([
            'name' => 'required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'nullable|in:planning,in_progress,completed,cancelled',
            'description' => 'nullable|string'
        ]);
        */
        $data = [];
        $project = Project::create($data);
        return response()->json($project, 201);
    }

    public function show($id)
    {
        return response()->json(Project::with('employees')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'nullable|in:planning,in_progress,completed,cancelled',
            'description' => 'nullable|string'
        ]);
        $project->update($data);
        return response()->json($project);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(null, 204);
    }
}
