<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateMovementTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('movement_type', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
        });

        DB::table('movement_type')->insert(
            array(
                array('name' => 'transport_resource'),
                array('name' => 'ground_attack'),
                array('name' => 'ground_defense')
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
        Schema::dropIfExists('movement_type');
        Schema::enableForeignKeyConstraints();
    }
}
