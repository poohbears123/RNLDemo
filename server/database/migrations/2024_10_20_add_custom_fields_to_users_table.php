<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('firstName');
            $table->string('middleName')->nullable();
            $table->string('lastName');
            $table->string('suffix')->nullable();
            $table->foreignId('gender_id')->constrained()->onDelete('set null');
            $table->date('dob')->nullable();
            $table->string('username')->unique();
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->text('address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['gender_id']);
            $table->dropColumn([
                'firstName',
                'middleName',
                'lastName',
                'suffix',
                'gender_id',
                'dob',
                'username',
                'status',
                'address',
            ]);
        });
    }
};

