<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateUnitTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('unit', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 25);
            $table->string('image');
            $table->text('text');
            $table->integer('population');
            $table->integer('size');
            $table->integer('wood');
            $table->integer('wine');
            $table->integer('glass');
            $table->integer('sulfur');
            $table->integer('time');
            $table->integer('barrack_level');
            $table->integer('gold');
            $table->integer('attack');
            $table->integer('attack_type');
            $table->integer('defense_blunt');
            $table->integer('defense_sharp');
            $table->integer('defense_distance');
        });

        DB::table('unit')->insert(
            array(
                array(
                    'name'  => 'Swordsmen',
                    'image' => '',
                    'text'  => 'Swordsmen are a slow defensive unit with heavy armor. They are effective in defense against several units. They are not recommended when attacking and should be used purely as a defensive units. They are strongest against ranged units such as slingers.',
                    'population' => 1,
                    'size' => 3,
                    'wood' => 150,
                    'wine' => 0,
                    'glass' => 0,
                    'sulfur' => 0,
                    'time' => 10,
                    'barrack_level' => 1,
                    'gold' => 2,
                    'attack' => 5,
                    'attack_type' => 1,
                    'defense_blunt' => 14,
                    'defense_sharp' => 8,
                    'defense_distance' => 30,
                ),
                array(
                    'name'  => 'Slinger',
                    'image' => '',
                    'text'  => 'Slingers are a cheap offensive unit. They are pretty fast and, in large numbers, are very strong attackers. In defense they are much less useful. They are best against hoplites and other slingers.',
                    'population' => 1,
                    'size' => 3,
                    'wood' => 70,
                    'wine' => 0,
                    'glass' => 0,
                    'sulfur' => 80,
                    'time' => 10,
                    'barrack_level' => 5,
                    'gold' => 3,
                    'attack' => 23,
                    'attack_type' => 3,
                    'defense_blunt' => 7,
                    'defense_sharp' => 8,
                    'defense_distance' => 2,
                ),
                array(
                    'name'  => 'Archer',
                    'image' => '',
                    'text'  => 'Archers have a relatively good speed and can carry a large amount of booty. However they are not good in attack, but are an essential part of a good defence. They are best used against hoplies and chariots.',
                    'population' => 1,
                    'size' => 3,
                    'wood' => 100,
                    'wine' => 0,
                    'glass' => 0,
                    'sulfur' => 50,
                    'time' => 10,
                    'barrack_level' => 9,
                    'gold' => 3,
                    'attack' => 8,
                    'attack_type' => 3,
                    'defense_blunt' => 7,
                    'defense_sharp' => 25,
                    'defense_distance' => 13,
                ),
                array(
                    'name'  => 'Hoplite',
                    'image' => '',
                    'text'  => 'Hoplites are a slow unit with sharp weapons. They are good in attack and reasonable in defence. Often hoplites are said to be a slow version of chariots , but they are slightly cheaper and cost less population in proportion to their attacking force.',
                    'population' => 1,
                    'size' => 3,
                    'wood' => 100,
                    'wine' => 0,
                    'glass' => 0,
                    'sulfur' => 100,
                    'time' => 10,
                    'barrack_level' => 13,
                    'gold' => 4,
                    'attack' => 16,
                    'attack_type' => 2,
                    'defense_blunt' => 18,
                    'defense_sharp' => 12,
                    'defense_distance' => 7,
                ),
                array(
                    'name'  => 'Horsemen',
                    'image' => '',
                    'text'  => 'Horsemen are very strong attacking units with high speed and a large carrying capacity for resources. They are quite expensive and have a very poor defence. They are best used against Swordsmen.',
                    'population' => 3,
                    'size' => 3,
                    'wood' => 230,
                    'wine' => 120,
                    'glass' => 0,
                    'sulfur' => 350,
                    'time' => 10,
                    'barrack_level' => 16,
                    'gold' => 9,
                    'attack' => 60,
                    'attack_type' => 1,
                    'defense_blunt' => 18,
                    'defense_sharp' => 1,
                    'defense_distance' => 24,
                ),
                array(
                    'name'  => 'Chariot',
                    'image' => '',
                    'text'  => 'Chariots are a fast, strong unit. They are both powerful attackers and strong defenders. You can use Zeus power "Divine Sign" to get chariots. They are expensive, but effective. Best used against Archers and Horsemen when attacking.',
                    'population' => 4,
                    'size' => 3,
                    'wood' => 300,
                    'wine' => 200,
                    'glass' => 0,
                    'sulfur' => 450,
                    'time' => 10,
                    'barrack_level' => 18,
                    'gold' => 12,
                    'attack' => 56,
                    'attack_type' => 2,
                    'defense_blunt' => 30,
                    'defense_sharp' => 30,
                    'defense_distance' => 30
                ),
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
        Schema::dropIfExists('unit');
        Schema::enableForeignKeyConstraints();
    }
}
