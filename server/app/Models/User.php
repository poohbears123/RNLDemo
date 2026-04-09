<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'firstName',
        'middleName',
        'lastName',
        'suffix',
        'gender_id',
        'dob',
        'username',
        'status',
        'address',
        'password',
        'name',
        'email',
        'email_verified_at',
        'remember_token',
    ];



    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    public function gender()
    {
        return $this->belongsTo(\App\Models\Gender::class);
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'dob' => 'date',
        ];
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            $user->name = trim($user->firstName . ' ' . ($user->middleName ? $user->middleName . ' ' : '') . $user->lastName . ($user->suffix ? ' ' . $user->suffix : ''));
        });

        static::updating(function ($user) {
            $user->name = trim($user->firstName . ' ' . ($user->middleName ? $user->middleName . ' ' : '') . $user->lastName . ($user->suffix ? ' ' . $user->suffix : ''));
        });
    }
}

