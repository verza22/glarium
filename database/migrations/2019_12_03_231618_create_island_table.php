<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Helpers\OtherHelper;
use Faker\Factory as Faker;

class CreateIslandTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('island', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('island_sector_id');
            $table->integer('x');
            $table->integer('y');
            $table->string('name');
            $table->integer('type');
            $table->unsignedBigInteger('forest_id');
            $table->unsignedBigInteger('mine_id');
            $table->integer('donated_forest');
            $table->integer('donated_mine');
            $table->dateTime('forest_constructed_at')->nullable();
            $table->dateTime('mine_constructed_at')->nullable();

            $table->foreign('island_sector_id')->references('id')->on('island_sector');
            $table->foreign('forest_id')->references('id')->on('forest');
            $table->foreign('mine_id')->references('id')->on('mine');
        });

        $faker = Faker::create();
        $data = OtherHelper::generateIslands();
        $array = [];
        for($y=0;$y<100;$y++)
        {
            for($x=0;$x<100;$x++)
            {
                if($data[$x][$y]['tipo'] == 'i')
                {
                    $aux['x'] = $x;
                    $aux['y'] = $y;
                    $aux['name'] = $faker->lastName;
                    $aux['type'] = $data[$x][$y]['resource'];
                    $aux['forest_id'] = 1;
                    $aux['mine_id'] = 1;
                    $aux['donated_forest'] = 0;
                    $aux['donated_mine'] = 0;
                    $aux['island_sector_id'] = $data[$x][$y]['sector'];
                    array_push($array,$aux);
                }
            }
        }
        usort($array, function($a, $b) {
            $retval = $a['island_sector_id'] <=> $b['island_sector_id'];
            if ($retval == 0) {
                $retval = $a['x'] <=> $b['x'];
                if ($retval == 0) {
                    $retval = $a['y'] <=> $b['y'];
                }
            }
            return $retval;
        });
        DB::table('island')->insert($array);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('island');
        Schema::enableForeignKeyConstraints();
    }
}
