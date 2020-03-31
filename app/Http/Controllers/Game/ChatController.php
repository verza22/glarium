<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\ChatNotification;
use Carbon\Carbon;
use Auth;

class ChatController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function send(Request $request)
    {
        $request->validate(['message'=>'required|string|max:50']);
        $user = Auth::user();
        $data['name'] = $user->name;
        $data['message'] = $request->input('message');
        $data['time'] = Carbon::now()->format('H:i');
        event(new ChatNotification('sendMessage',$data));
    }
}
