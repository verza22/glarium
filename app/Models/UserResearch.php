<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserResearch extends Model
{
    protected $table = 'user_research';

    protected $fillable = ['user_id','research_id'];

    public function research()
    {
        return $this->belongsTo('App\Models\Research');
    }
}
