<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Auth;

class UserNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;
    private $event;
    private $channel;

    public function __construct($event,$data,$user_id = null)
    {
        $user_id = $user_id==null ? Auth::id() : $user_id;
        $this->channel = 'user_'.$user_id;
        $this->event = $event;
        $this->data = $data;
    }

    public function broadcastOn()
    {
        return $this->channel;
    }

    public function broadcastAs()
    {
        return $this->event;
    }
}
