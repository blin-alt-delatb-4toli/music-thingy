<!doctype html>

<html lang="{{ app()->getLocale() }}">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link href="{{ asset('css/app.css') }}" rel="stylesheet">

        <title>Laravel React application</title>
        @viteReactRefresh
        @vite('app.tsx')
        @vite('resources/css/music.css')
    </head>

    <body>
        <div id="root"></div>
    </body>
    
</html>