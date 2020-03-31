<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ChatNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;
    private $event;
    private $channel = 'chat';

    public function __construct($event,$data)
    {
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
