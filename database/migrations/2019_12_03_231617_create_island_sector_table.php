<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Faker\Factory as Faker;

class CreateIslandSectorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('island_sector', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
        });

        $faker = Faker::create();
        for($i=0;$i<105;$i++)
        {
            $data[$i]['name'] = $faker->firstName;
        }

        DB::table('island_sector')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('island_sector');
        Schema::enableForeignKeyConstraints();
    }
}
