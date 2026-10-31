<?php

namespace App\Services;

class TopicCatalog
{
    public const TOPICS = [
        'Dasar PHP',
        'Variabel dan Tipe Data',
        'Operator',
        'Conditional',
        'Looping',
        'Array',
        'Function',
        'String',
        'Object Oriented Programming / OOP',
        'Database / MySQL',
        'CRUD',
        'Error Handling',
    ];

    public static function normalize(?string $value): string
    {
        $topic = trim((string) $value);
        $lower = mb_strtolower($topic);

        if (str_contains($lower, 'oop') || str_contains($lower, 'object')) return 'Object Oriented Programming / OOP';
        if (str_contains($lower, 'database') || str_contains($lower, 'mysql') || str_contains($lower, 'pdo') || str_contains($lower, 'sql')) return 'Database / MySQL';
        if (str_contains($lower, 'variable') || str_contains($lower, 'tipe data') || str_contains($lower, 'type')) return 'Variabel dan Tipe Data';
        if (str_contains($lower, 'operator')) return 'Operator';
        if (str_contains($lower, 'conditional') || str_contains($lower, 'condition') || str_contains($lower, 'percabangan')) return 'Conditional';
        if (str_contains($lower, 'loop') || str_contains($lower, 'perulangan') || str_contains($lower, 'iteration')) return 'Looping';
        if (str_contains($lower, 'array')) return 'Array';
        if (str_contains($lower, 'function') || str_contains($lower, 'fungsi') || str_contains($lower, 'closure')) return 'Function';
        if (str_contains($lower, 'string')) return 'String';
        if (str_contains($lower, 'crud')) return 'CRUD';
        if (str_contains($lower, 'error') || str_contains($lower, 'exception')) return 'Error Handling';
        if (str_contains($lower, 'dasar') || str_contains($lower, 'basic') || str_contains($lower, 'syntax')) return 'Dasar PHP';

        return in_array($topic, self::TOPICS, true) ? $topic : 'Dasar PHP';
    }

    public static function focus(string $topic): string
    {
        return match ($topic) {
            'Dasar PHP' => 'Sintaks dasar, eksekusi skrip, dan penulisan tag PHP yang benar.',
            'Variabel dan Tipe Data' => 'Type coercion, strict typing, dan pemilihan tipe data.',
            'Operator' => 'Operator perbandingan, logika, null coalescing, dan operator modern PHP.',
            'Conditional' => 'Percabangan if, switch, match expression, dan guard clauses.',
            'Looping' => 'For, while, foreach, kontrol iterasi, dan generator.',
            'Array' => 'Array numerik dan asosiatif serta fungsi map, filter, dan reduce.',
            'Function' => 'Parameter, return value, closure, scope, dan named arguments.',
            'String' => 'Interpolasi, manipulasi string, dan keamanan output.',
            'Object Oriented Programming / OOP' => 'Class, object, inheritance, encapsulation, dan interface.',
            'Database / MySQL' => 'PDO, prepared statement, transaksi, dan koneksi database.',
            'CRUD' => 'Validasi input dan operasi create, read, update, dan delete yang aman.',
            'Error Handling' => 'Exception, try/catch/finally, dan pencatatan error.',
            default => "Perkuat pemahaman dan praktik pada {$topic}.",
        };
    }
}
