const YMID = 56906062;

export default function({ app }) {
    /*
    ** Only run on client-side and only in production mode
    */
    if (process.env.NODE_ENV !== 'production') {
        return;
    }

    window.ym=window.ym || function(){
        (window.ym.a=window.ym.a||[]).push(arguments)
    };
    window.ym.l=1*new Date();

    window.ym(YMID, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
    });

    /*
    ** Include script
    */
    let script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.body.appendChild(script);

    /*
    ** Every time the route changes (fired on initialization too)
    */
    app.router.afterEach((to, from) => {
        window.ym(YMID, 'hit', to.fullPath)
    });
}
