<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateForestTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('forest', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('level');
            $table->integer('workers');
            $table->integer('wood');
            $table->integer('time');
        });

        DB::table('forest')->insert(
            array(
                array('level'=> 1,'workers' => 45,'wood' => 0,'time' => 0),
                array('level'=> 2,'workers' => 57,'wood' => 394,'time' => 60),
                array('level'=> 3,'workers' => 75,'wood' => 992,'time' => 80),
                array('level'=> 4,'workers' => 96,'wood' => 1732,'time' => 120),
                array('level'=> 5,'workers' => 120,'wood' => 2788,'time' => 150),
                array('level'=> 6,'workers' => 144,'wood' => 3783,'time' => 180),
                array('level'=> 7,'workers' => 171,'wood' => 5632,'time' => 210),
                array('level'=> 8,'workers' => 201,'wood' => 8139,'time' => 240),
                array('level'=> 9,'workers' => 231,'wood' => 10452,'time' => 270)
            )
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('forest');
        Schema::enableForeignKeyConstraints();
    }
}
