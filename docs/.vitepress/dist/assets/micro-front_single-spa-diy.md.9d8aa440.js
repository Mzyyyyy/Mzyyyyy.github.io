import{_ as n,c as s,o as a,a as p}from"./app.34e5d764.js";const w='{"title":"single-spa","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u5E94\u7528\u72B6\u6001","slug":"\u5E94\u7528\u72B6\u6001"},{"level":2,"title":"\u5E94\u7528\u6CE8\u518C\uFF08registerApplication\uFF09","slug":"\u5E94\u7528\u6CE8\u518C\uFF08registerapplication\uFF09"},{"level":2,"title":"\u57FA\u5EA7\u5E94\u7528\u542F\u52A8(start)","slug":"\u57FA\u5EA7\u5E94\u7528\u542F\u52A8-start"},{"level":2,"title":"\u66F4\u65B0\u5E94\u7528\u76F8\u5173(reroute)","slug":"\u66F4\u65B0\u5E94\u7528\u76F8\u5173-reroute"},{"level":2,"title":"\u8DEF\u7531\u76D1\u542C","slug":"\u8DEF\u7531\u76D1\u542C"},{"level":2,"title":"\u7ED3\u675F","slug":"\u7ED3\u675F"}],"relativePath":"micro-front/single-spa-diy.md","lastUpdated":1660483913381}',t={},o=p(`<h1 id="single-spa" tabindex="-1">single-spa <a class="header-anchor" href="#single-spa" aria-hidden="true">#</a></h1><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90696bfd17824a8bb8c7a977af92e22a~tplv-k3u1fbpfcp-watermark.image?" alt="single-spa.png"></p><p><code>\u672C\u6587\u9700\u7ED3\u5408single-spa\u6E90\u7801\u98DF\u7528\uFF0C\u5982\u4E0A\u56FE\uFF0C\u5176\u5927\u81F4\u5B9E\u73B0\u65B9\u5411\u4E3A\u5E94\u7528\u6CE8\u518C\u3001\u5E94\u7528\u66F4\u65B0\u3001\u8DEF\u7531\u76D1\u542C\u4E09\u4E2A\u4E3B\u8981\u529F\u80FD</code></p><p><a href="https://github.com/single-spa/single-spa" target="_blank" rel="noopener noreferrer">single-spa\u6E90\u7801\u5730\u5740</a></p><h2 id="\u5E94\u7528\u72B6\u6001" tabindex="-1">\u5E94\u7528\u72B6\u6001 <a class="header-anchor" href="#\u5E94\u7528\u72B6\u6001" aria-hidden="true">#</a></h2><p>\u4E3A\u4E86\u66F4\u76F4\u89C2\u4F53\u73B0\uFF0C\u6211\u628A\u6240\u6709\u5B50\u5E94\u7528\u72B6\u6001\u5148\u62BD\u79BB\u51FA\u6765\u653E\u5728\u524D\u9762\uFF0C\u65B9\u4FBF\u540E\u9762\u7684\u4F7F\u7528\u3002</p><div class="language-js"><pre><code><span class="token keyword">const</span> <span class="token constant">NOT_LOADED</span> <span class="token operator">=</span> <span class="token string">&#39;NOT_LOADED&#39;</span> <span class="token comment">// \u672A\u52A0\u8F7D/\u5F85\u52A0\u8F7D</span>
<span class="token comment">// \u672A\u52A0\u8F7D(\u5F85\u52A0\u8F7D)\u6BCF\u4E2A\u5B50\u5E94\u7528\u7684\u9ED8\u8BA4\u72B6\u6001\uFF0C\u610F\u5473\u7740\u4E3B\u5E94\u7528\u8FD8\u6CA1\u6709\u83B7\u53D6\u5230\u5B50\u5E94\u7528\u7684 bootstrap\u3001mount\u3001unmount\u3001unload \u65B9\u6CD5\u3002</span>

<span class="token keyword">const</span> <span class="token constant">LOAD_SOURCE_CODE</span> <span class="token operator">=</span> <span class="token string">&#39;LOAD_SOURCE_CODE&#39;</span> <span class="token comment">// \u52A0\u8F7D\u6E90\u4EE3\u7801</span>
<span class="token comment">// \u5728\u8FD9\u4E2A\u9636\u6BB5\uFF0Csingle-spa \u4F1A\u6267\u884C\u5B50\u5E94\u7528\u6CE8\u518C\u65F6\u63D0\u4F9B\u7684 loadApp \u65B9\u6CD5\uFF0C\u53BB\u52A8\u6001\u83B7\u53D6\u5B50\u5E94\u7528\u7684\u5165\u53E3 js \u6587\u4EF6\uFF0C\u7136\u540E\u6267\u884C\uFF0C\u5F97\u5230\u5B50\u5E94\u7528\u7684 bootstrap\u3001mount\u3001unmount\u3001unload \u65B9\u6CD5\u3002</span>

<span class="token keyword">const</span> <span class="token constant">NOT_BOOTSTRAPPED</span> <span class="token operator">=</span> <span class="token string">&#39;NOT_BOOTSTRAPPED&#39;</span> <span class="token comment">// \u672A\u542F\u52A8/\u5F85\u542F\u52A8</span>
<span class="token comment">// \u5F97\u5230\u5B50\u5E94\u7528\u7684 bootstrap\u3001mount\u3001unmount\u3001unload\u3001update \u65B9\u6CD5\u4EE5\u540E\uFF0Csingle-spa \u4F1A\u5C06\u8FD9\u4E9B\u65B9\u6CD5\u6DFB\u52A0\u5230\u5B50\u5E94\u7528\u5BF9\u8C61\u4E2D\u3002 \u6DFB\u52A0\u5B8C\u6BD5\u4EE5\u540E\uFF0C\u5B50\u5E94\u7528\u7684\u72B6\u6001\u5C31\u53D8\u4E3A not_bootstrapped\uFF0C\u7B49\u5F85\u88AB\u542F\u52A8\u3002</span>

<span class="token keyword">const</span> <span class="token constant">BOOTSTRAPPING</span> <span class="token operator">=</span> <span class="token string">&#39;BOOTSTRAPPING&#39;</span>  <span class="token comment">// \u5B50\u5E94\u7528\u542F\u52A8\u4E2D</span>
<span class="token comment">// \u5B50\u5E94\u7528\u88AB\u6FC0\u6D3B\u4EE5\u540E\uFF0C\u5C31\u4F1A\u8FDB\u5165 BOOTSTRAPPING \u9636\u6BB5\u3002\u6B64\u65F6\u5982\u679C\u5B50\u5E94\u7528\u63D0\u4F9B\u4E86 bootstrap \u65B9\u6CD5\uFF0C\u90A3\u4E48 bootstrap \u65B9\u6CD5\u5C31\u4F1A\u89E6\u53D1\u3002</span>

<span class="token keyword">const</span> <span class="token constant">NOT_MOUNTED</span> <span class="token operator">=</span> <span class="token string">&#39;NOT_MOUNTED&#39;</span> <span class="token comment">// \u672A\u6302\u8F7D/\u5F85\u6302\u8F7D</span>
<span class="token comment">// \u5B50\u5E94\u7528\u542F\u52A8\u4EE5\u540E\uFF0C\u81EA\u52A8\u8FDB\u5165 NOT_MOUNTED \u9636\u6BB5\u3002</span>

<span class="token keyword">const</span> <span class="token constant">MOUNTING</span> <span class="token operator">=</span> <span class="token string">&#39;MOUNTING&#39;</span> <span class="token comment">// \u5B50\u5E94\u7528\u6302\u8F7D\u4E2D</span>
<span class="token comment">// \u5728\u8FD9\u4E2A\u9636\u6BB5\uFF0C\u81EA\u52A8\u89E6\u53D1\u5B50\u5E94\u7528\u63D0\u4F9B\u7684 mount \u65B9\u6CD5\u3002</span>

<span class="token keyword">const</span> <span class="token constant">MOUNTED</span> <span class="token operator">=</span> <span class="token string">&#39;MOUNTED&#39;</span> <span class="token comment">// \u5B50\u5E94\u7528\u5DF2\u6302\u8F7D</span>
<span class="token comment">// \u5B50\u5E94\u7528\u6302\u8F7D\u5B8C\u6BD5\uFF0C\u5B50\u5E94\u7528\u7684\u72B6\u6001\u53D8\u4E3A MOUNTED\u3002</span>

<span class="token keyword">const</span> <span class="token constant">UNMOUNTING</span> <span class="token operator">=</span> <span class="token string">&#39;UNMOUNTING&#39;</span> <span class="token comment">// \u6B63\u5728\u6302\u8F7D</span>
<span class="token comment">// \u5982\u679C\u4E00\u4E2A\u5B50\u5E94\u7528\u9700\u8981\u88AB\u5378\u8F7D\uFF0C\u90A3\u4E48\u8FD9\u4E2A\u5B50\u5E94\u7528\u7684\u72B6\u6001\u5C31\u4F1A\u53D8\u4E3A UNMOUNTING\u3002</span>
<span class="token comment">// \u6B64\u65F6\uFF0C\u5B50\u5E94\u7528\u7684 unmount \u65B9\u6CD5\u4F1A\u6267\u884C\u3002</span>

<span class="token keyword">const</span> <span class="token constant">UNMOUNTED</span> <span class="token operator">=</span> <span class="token string">&#39;UNMOUNTED&#39;</span> <span class="token comment">// \u5378\u8F7D\u5B8C\u6BD5</span>
<span class="token comment">// \u5B50\u5E94\u7528\u5378\u8F7D\u5B8C\u6BD5\u4EE5\u540E\uFF0C\u5B50\u5E94\u7528\u7684\u72B6\u6001\u5C31\u4F1A\u53D8\u4E3A UNMOUNTED\u3002</span>

<span class="token keyword">const</span> <span class="token constant">LOAD_ERROR</span> <span class="token operator">=</span> <span class="token string">&#39;LOAD_ERROR&#39;</span>  <span class="token comment">// load\u5931\u8D25</span>
<span class="token comment">// \u5B50\u5E94\u7528\u52A0\u8F7D\u5931\u8D25\uFF0C\u5B50\u5E94\u7528\u7684\u72B6\u6001\u5C31\u4F1A\u53D8\u4E3A LOAD_ERROR\u3002</span>
</code></pre></div><p><code>\u4ECE\u6700\u76F4\u63A5\u88AB\u4F7F\u7528\u7684\u4E24\u4E2A\u65B9\u6CD5\u5165\u624B\uFF1A\u5B50\u5E94\u7528\u7684\u6CE8\u518C\u548C\u57FA\u5EA7\u5E94\u7528\u7684\u542F\u52A8</code></p><h2 id="\u5E94\u7528\u6CE8\u518C\uFF08registerapplication\uFF09" tabindex="-1">\u5E94\u7528\u6CE8\u518C\uFF08registerApplication\uFF09 <a class="header-anchor" href="#\u5E94\u7528\u6CE8\u518C\uFF08registerapplication\uFF09" aria-hidden="true">#</a></h2><ul><li>\u5E94\u7528\u6CE8\u518C\u65B9\u6CD5\u4E3B\u8981\u662F\u5BF9\u5B50\u5E94\u7528\u53C2\u6570\u8FDB\u884C\u683C\u5F0F\u5316\u540E\uFF0C\u5C06\u5B50\u5E94\u7528\u653E\u5165\u5E94\u7528\u5217\u8868\u4E2D\uFF0C\u5E76\u628A\u5E94\u7528\u72B6\u6001\u521D\u59CB\u5316\u4E3A<code>NOT_LOADED</code></li></ul><div class="language-js"><pre><code><span class="token keyword">const</span> apps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

<span class="token keyword">function</span> <span class="token function">registerApplication</span><span class="token punctuation">(</span><span class="token parameter">appName<span class="token punctuation">,</span>appLoadFn<span class="token punctuation">,</span>activeWhen<span class="token punctuation">,</span>customProps</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token punctuation">{</span>
        appName<span class="token punctuation">,</span> <span class="token comment">// \u5B50\u5E94\u7528\u540D</span>
        appLoadFn<span class="token punctuation">,</span> <span class="token comment">// \u5B50\u5E94\u7528\u52A0\u8F7D\u65B9\u5F0F</span>
        activeWhen<span class="token punctuation">,</span> <span class="token comment">// \u5B50\u5E94\u7528\u6FC0\u6D3B\u5339\u914D\u89C4\u5219</span>
        customProps <span class="token comment">// \u81EA\u5B9A\u4E49props</span>
    <span class="token punctuation">}</span>
    apps<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>
        <span class="token punctuation">{</span>
            status<span class="token operator">:</span> <span class="token constant">NOT_LOADED</span><span class="token punctuation">,</span>
            <span class="token operator">...</span>app
        <span class="token punctuation">}</span>
    <span class="token punctuation">)</span>
    <span class="token comment">// reroute\u65B9\u6CD5\u4E3B\u8981\u7528\u4E8E\u66F4\u65B0\u5E94\u7528\u72B6\u6001\u5E76\u5B8C\u6210\u52A0\u8F7D\u5378\u8F7D\u64CD\u4F5C\uFF0C\u5177\u4F53\u5B9E\u73B0\u5728\u540E\u9762</span>
    <span class="token function">reroute</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="\u57FA\u5EA7\u5E94\u7528\u542F\u52A8-start" tabindex="-1">\u57FA\u5EA7\u5E94\u7528\u542F\u52A8(start) <a class="header-anchor" href="#\u57FA\u5EA7\u5E94\u7528\u542F\u52A8-start" aria-hidden="true">#</a></h2><ul><li>\u8FD9\u91CC\u6BD4\u8F83\u7B80\u5355\uFF0C\u53EA\u9700\u8981\u5BF9\u57FA\u5EA7\u552F\u4E00\u72B6\u6001\u503C\u8FDB\u884C\u66F4\u6539</li></ul><div class="language-js"><pre><code><span class="token comment">// const apps = []</span>
<span class="token keyword">let</span> isStarted <span class="token operator">=</span> <span class="token boolean">false</span>

<span class="token keyword">function</span> <span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    isStarted <span class="token operator">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
<span class="token comment">// function registerApplication(appName,appLoadFn,activeWhen,customProps){</span>
<span class="token comment">//  ...</span>
<span class="token comment">// }</span>
</code></pre></div><h2 id="\u66F4\u65B0\u5E94\u7528\u76F8\u5173-reroute" tabindex="-1">\u66F4\u65B0\u5E94\u7528\u76F8\u5173(reroute) <a class="header-anchor" href="#\u66F4\u65B0\u5E94\u7528\u76F8\u5173-reroute" aria-hidden="true">#</a></h2><ul><li>reroute\u65B9\u6CD5\u662F\u5BF9\u66F4\u6539\u6240\u6709\u9700\u8981\u66F4\u6539\u7684\u5E94\u7528\u72B6\u6001\uFF0C\u5E76\u6267\u884C\u5BF9\u5E94\u64CD\u4F5C\uFF08\u8BE5\u6302\u8F7D\u7684\u6302\u8F7D\uFF0C\u8BE5\u5378\u8F7D\u7684\u5378\u8F7D\uFF0C\u6539\u4E3A\u4ED6\u5E94\u8BE5\u5904\u5728\u7684\u72B6\u6001\uFF09,\u5176\u5B9E\u5C31\u662Furl\u6539\u53D8\u540E\u9700\u8981\u505A\u7684\u64CD\u4F5C\u3002</li></ul><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">reroute</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">// \u9996\u5148\u8981\u904D\u5386\u6240\u6709\u5B50\u5E94\u7528\uFF0C\u5E76\u8FDB\u884C\u5F52\u7C7B\uFF0C\u5206\u4E3A4\u7C7B\uFF1A\u5F85\u52A0\u8F7D\u3001\u5F85\u79FB\u9664\u3001\u5F85\u6302\u8F7D\u3001\u5F85\u5378\u8F7D</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span>
        appsToLoad
        appsToMount
        appsToUnmount
        <span class="token comment">// appsToUnload</span>
    <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">getApps</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token comment">// \u5BF9\u6240\u7528\u5E94\u7528\u8FDB\u884C\u5F52\u7C7B\u540E\uFF0C\u5C31\u53EF\u4EE5\u5BF9\u5176\u8FDB\u884C\u5206\u522B\u5904\u7406</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>isStarted<span class="token punctuation">)</span><span class="token punctuation">{</span> 
        appsToLoad<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>toLoad<span class="token punctuation">)</span> <span class="token comment">// \u8FD9\u91CC\u53EF\u89C1\u5E94\u7528\u6CA1\u542F\u52A8\u65F6\u5DF2\u7ECF\u4F1A\u5BF9\u6240\u7528\u5B50\u5E94\u7528\u8FDB\u884Cload\u52A0\u8F7D</span>
    <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>
        <span class="token comment">// \u53EA\u6709\u5F53\u57FA\u5EA7\u5E94\u7528\u542F\u52A8\u4E86\u624D\u4F1A\u8FDB\u884C\u5B50\u5E94\u7528\u7684\u6302\u8F7D\uFF0C\u5426\u5219\u53EA\u9700\u8981\u5BF9\u5B50\u5E94\u7528\u8FDB\u884C\u5185\u5BB9\u7684\u52A0\u8F7D/\u5378\u8F7D\u5373\u53EF</span>
        appsToMount<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>tryBootstrapAndMount<span class="token punctuation">)</span>
        appsToUnmount<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>toUnMount<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">/**
     * \u5B50\u5E94\u7528\u52A0\u8F7D\u65B9\u6CD5,\u5FC5\u987B\u6700\u5148\u52A0\u8F7D\u5E94\u7528
     */</span>
    <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">toLoad</span><span class="token punctuation">(</span><span class="token parameter">app</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        app<span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">LOAD_SOURCE_CODE</span>
        <span class="token comment">// \u4ECEapp\u7684\u52A0\u8F7D\u51FD\u6570\u4E2D\u5BFC\u51FA\u751F\u547D\u5468\u671F\u94A9\u5B50\u65B9\u6CD5</span>
        <span class="token keyword">let</span> <span class="token punctuation">{</span>
            bootstrap<span class="token punctuation">,</span>
            mount<span class="token punctuation">,</span>
            unmount<span class="token punctuation">,</span>
            unload
        <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">await</span> app<span class="token punctuation">.</span><span class="token function">appLoadFn</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        app<span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">NOT_BOOTSTRAPPED</span>
        <span class="token comment">// \u5E76\u5C06\u6240\u6709\u94A9\u5B50\u76F4\u63A5\u6302\u5728app\u4E0A\uFF0C\u65B9\u4FBF\u540E\u7EED\u4F7F\u7528\uFF0C\u4E0B\u6587\u5DF2\u7528TODO\u6807\u6CE8\u4F7F\u7528\u7684\u5730\u65B9</span>
        app<span class="token punctuation">.</span>bootstrap <span class="token operator">=</span> bootstrap
        app<span class="token punctuation">.</span>mount <span class="token operator">=</span> mount
        app<span class="token punctuation">.</span>unmount <span class="token operator">=</span> unmount
        app<span class="token punctuation">.</span>unload <span class="token operator">=</span> unload
    <span class="token punctuation">}</span>

    <span class="token comment">/**
     * \u5B50\u5E94\u7528\u6302\u8F7D\u65B9\u6CD5
     */</span>
    <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">tryBootstrapAndMount</span><span class="token punctuation">(</span><span class="token parameter">app</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token comment">// \u5B9A\u4E49\u4E00\u4E2A\u72B6\u6001\u5224\u65AD\u5F53\u524Durl\u662F\u5426\u5339\u914D\u5F53\u524D\u5E94\u7528\uFF0C\u5339\u914D\u5219\u9700\u8981\u6FC0\u6D3B\u5F53\u524D\u5E94\u7528 </span>
        <span class="token keyword">const</span> shoudBeActive <span class="token operator">=</span> app<span class="token punctuation">.</span><span class="token function">activeWhen</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>location<span class="token punctuation">)</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>shoudBeActive<span class="token punctuation">)</span><span class="token punctuation">{</span>
            app<span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">BOOTSTRAPPING</span> 
            <span class="token keyword">await</span> app<span class="token punctuation">.</span><span class="token function">bootstrap</span><span class="token punctuation">(</span>app<span class="token punctuation">.</span>customProps<span class="token punctuation">)</span>   <span class="token comment">// \uFF01\uFF01\uFF01TODO \u8FD9\u91CC\u7528\u5230\u4E86\u5E94\u7528\u7684\u7B2C\u4E00\u4E2A\u65B9\u6CD5\uFF1Abootstrap</span>
            app<span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">NOT_MOUNTED</span> <span class="token comment">// \u6B64\u65F6\u5B50\u5E94\u7528\u542F\u52A8\u5B8C\u6210</span>

            <span class="token keyword">if</span><span class="token punctuation">(</span>shoudBeActive<span class="token punctuation">)</span><span class="token punctuation">{</span> 
                <span class="token comment">// \u56E0\u4E3A\u6709\u5F02\u6B65\u64CD\u4F5C\uFF0C\u9700\u8981\u518D\u4E8C\u6B21\u5224\u65AD\uFF0C\u9632\u6B62\u5728\u5F02\u6B65\u52A0\u8F7D\u8FC7\u7A0B\u4E2D\u7528\u6237\u624B\u52A8\u5207\u6362url\u5BFC\u81F4\u6302\u8F7D\u9519\u8BEF</span>
                app<span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">MOUNTING</span>
                <span class="token keyword">await</span> app<span class="token punctuation">.</span><span class="token function">mount</span><span class="token punctuation">(</span>app<span class="token punctuation">.</span>customProps<span class="token punctuation">)</span> <span class="token comment">// \uFF01\uFF01\uFF01TODO \u8FD9\u91CC\u7528\u5230\u4E86\u5E94\u7528\u7684\u7B2C\u4E8C\u4E2A\u65B9\u6CD5\uFF1Amount</span>
                app<span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">MOUNTED</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token comment">/**
     * \u5B50\u5E94\u7528\u5378\u8F7D\u65B9\u6CD5
     */</span>
    <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">toUnmount</span> <span class="token punctuation">(</span><span class="token parameter">app</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>app<span class="token punctuation">.</span>status <span class="token operator">!==</span> <span class="token constant">MOUNTED</span><span class="token punctuation">)</span> <span class="token keyword">return</span>
        app<span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">MOUNTING</span>
        <span class="token keyword">await</span> app<span class="token punctuation">.</span><span class="token function">unmount</span><span class="token punctuation">(</span>app<span class="token punctuation">.</span>customProps<span class="token punctuation">)</span> <span class="token comment">// // \uFF01\uFF01\uFF01TODO \u8FD9\u91CC\u7528\u5230\u4E86\u5E94\u7528\u7684\u7B2C\u4E09\u4E2A\u65B9\u6CD5\uFF1Aunmount</span>
        app<span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">NOT_MOUNTED</span>
        <span class="token keyword">return</span> app
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">getApps</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">// \u5F85\u52A0\u8F7D\u3001\u5F85\u79FB\u9664\u3001\u5F85\u6302\u8F7D\u3001\u5F85\u5378\u8F7D\u5E94\u7528\u6570\u7EC4</span>
    <span class="token keyword">const</span> appsToLoad <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">const</span> appsToUnload <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">const</span> appsToMount <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">const</span> appsToUnmount <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    
    apps<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">app</span><span class="token punctuation">)</span><span class="token operator">=&gt;</span><span class="token punctuation">{</span>
        <span class="token comment">// \u5B9A\u4E49\u4E00\u4E2A\u72B6\u6001\u5224\u65AD\u5F53\u524Durl\u662F\u5426\u5339\u914D\u5F53\u524D\u5E94\u7528\uFF0C\u5339\u914D\u5219\u9700\u8981\u6FC0\u6D3B\u5F53\u524D\u5E94\u7528\uFF0C\u8FD9\u91CC\u53EF\u4EE5\u62BD\u6210\u516C\u5171\u65B9\u6CD5\u5224\u65AD\uFF0C\u4E3A\u4E86\u66F4\u6613\u9605\u8BFB\uFF0C\u8FD9\u91CC\u91CD\u65B0\u5B9A\u4E49</span>
        <span class="token keyword">const</span> shoudBeActive <span class="token operator">=</span> app<span class="token punctuation">.</span><span class="token function">activeWhen</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>location<span class="token punctuation">)</span> 

        <span class="token keyword">switch</span> <span class="token punctuation">(</span>app<span class="token punctuation">.</span>status<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">case</span> <span class="token constant">NOT_LOADED</span><span class="token operator">:</span> <span class="token comment">// \u72B6\u6001\u4E3ANOT_LOADED\u65F6\u53EA\u6709url\u5339\u914D\u624D\u8981load\u5E94\u7528\u6240\u4EE5shoudBeActive\u65F6\u52A0\u5230\u5F85\u52A0\u8F7D\u6570\u7EC4\u4E2D</span>
                <span class="token keyword">if</span><span class="token punctuation">(</span>shoudBeActive<span class="token punctuation">)</span><span class="token punctuation">{</span>
                    appsToLoad<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span>
                <span class="token punctuation">}</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token constant">NOT_BOOTSTRAPPED</span><span class="token operator">:</span>
            <span class="token keyword">case</span> <span class="token constant">NOT_MOUNTED</span><span class="token operator">:</span> <span class="token comment">// \u5F53\u52A0\u8F7D\u5B8C\u540E\uFF0C\u9700\u8981\u6FC0\u6D3B\u65F6\u624D\u5C06\u5E94\u7528\u653E\u5165\u5F85\u6302\u8F7D\u6570\u7EC4\u91CD</span>
                <span class="token keyword">if</span><span class="token punctuation">(</span>appShouldBeActive<span class="token punctuation">)</span><span class="token punctuation">{</span>
                    appsToMount<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> 
                <span class="token comment">// else {</span>
                <span class="token comment">//     appsToUnload.push(app); // \u8FD9\u91CC\u7684\u79FB\u9664\u64CD\u4F5C\u4E0D\u5F71\u54CD\u4E3B\u6D41\u7A0B\u7684\u5B9E\u73B0\uFF0C\u987E\u4E0D\u505A\u6DF1\u5165</span>
                <span class="token comment">// }</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token constant">MOUNTED</span><span class="token operator">:</span>
                <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>appShouldBeActive<span class="token punctuation">)</span><span class="token punctuation">{</span> <span class="token comment">// \u5F53\u5E94\u7528\u5DF2\u7ECF\u6302\u5728\uFF0C\u5E76\u4E14\u4E0D\u9700\u8981\u6FC0\u6D3B\u5F53\u524D\u5E94\u7528\u65F6\uFF0C\u52A0\u5165\u5F85\u5378\u8F7D\u6570\u7EC4\u4E2D\u7B49\u5F85\u5378\u8F7D</span>
                    appsToUnmount<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span>
                <span class="token punctuation">}</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token keyword">default</span><span class="token operator">:</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span> appsToLoad<span class="token punctuation">,</span> appsToUnload<span class="token punctuation">,</span> appsToMount<span class="token punctuation">,</span> appsToUnmount <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="\u8DEF\u7531\u76D1\u542C" tabindex="-1">\u8DEF\u7531\u76D1\u542C <a class="header-anchor" href="#\u8DEF\u7531\u76D1\u542C" aria-hidden="true">#</a></h2><ul><li>\u622A\u6B62\u76EE\u524D\uFF0C\u6211\u4EEC\u5DF2\u7ECF\u505A\u597D\u4E86\u6240\u6709\u5E94\u7528\u7684\u76F8\u5173\u64CD\u4F5C\uFF1A\u5B50\u5E94\u7528\u7684\u52A0\u8F7D\u3001\u4EE5\u53CA\u8DEF\u7531\u53D8\u5316\u540E\u6240\u505A\u7684\u6302\u8F7D\u3001\u5378\u8F7D\u7B49\uFF0C\u8FD8\u5269\u4E0B\u6700\u540E\u4E00\u6B65\u8DEF\u7531\u7684\u76D1\u542C\uFF0C\u53EA\u6709\u76D1\u542C\u4E86\u8DEF\u7531\u7684\u6539\u53D8\uFF0C\u6211\u4EEC\u7684single-spa\u624D\u80FD\u5BF9\u5B50\u5E94\u7528\u6267\u884C\u76F8\u5E94\u7684\u64CD\u4F5C</li></ul><div class="language-js"><pre><code>    <span class="token comment">// \u76D1\u542Cwindow\u7684hashchange\u3001popstate\u4E24\u4E2A\u4E8B\u4EF6\uFF0C\u4E00\u65E6url\u6539\u53D8\u6267\u884Creroute\u64CD\u4F5C</span>
    window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;hashchange&quot;</span><span class="token punctuation">,</span> reroute<span class="token punctuation">)</span><span class="token punctuation">;</span>
    window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;popstate&quot;</span><span class="token punctuation">,</span> reroute<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// \u4E0B\u9762\u662F\u5BF9window history\u76F8\u5173\u4E8B\u4EF6\u7684\u589E\u5F3A\uFF0C\u4E3B\u8981\u662F\u5728\u5176\u65B9\u6CD5\u5185\u6DFB\u52A0reroute\u7684\u6267\u884C</span>
    window<span class="token punctuation">.</span>history<span class="token punctuation">.</span>pushState <span class="token operator">=</span> <span class="token function">patchedUpdateState</span><span class="token punctuation">(</span>
        window<span class="token punctuation">.</span>history<span class="token punctuation">.</span>pushState<span class="token punctuation">,</span>
        <span class="token string">&quot;pushState&quot;</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    window<span class="token punctuation">.</span>history<span class="token punctuation">.</span>replaceState <span class="token operator">=</span> <span class="token function">patchedUpdateState</span><span class="token punctuation">(</span>
        window<span class="token punctuation">.</span>history<span class="token punctuation">.</span>replaceState<span class="token punctuation">,</span>
        <span class="token string">&quot;replaceState&quot;</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// \u8BE5\u65B9\u6CD5\u7528\u4E8E\u5BF9window.history\u4E8B\u4EF6\u7684\u5305\u88C5</span>
    <span class="token keyword">function</span> <span class="token function">patchedUpdateState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> urlBefore <span class="token operator">=</span> window<span class="token punctuation">.</span>location<span class="token punctuation">.</span>href<span class="token punctuation">;</span>
            <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token function">updateState</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \u8FD9\u91CC\u662F\u7EF4\u6301\u6267\u884C\u539F\u6765\u7684\u4E8B\u4EF6\u5185\u5BB9\u5E76\u62FF\u5230\u8FD4\u56DE\u503C</span>
            <span class="token keyword">const</span> urlAfter <span class="token operator">=</span> window<span class="token punctuation">.</span>location<span class="token punctuation">.</span>href<span class="token punctuation">;</span>

            <span class="token keyword">if</span> <span class="token punctuation">(</span>urlBefore <span class="token operator">!==</span> urlAfter<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">// \u53D8\u66F4\u524D\u540Eurl\u4E0D\u4E00\u6837 \u5219\u51FA\u53D1reroute</span>
                reroute
            <span class="token punctuation">}</span>
            <span class="token keyword">return</span> result<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre></div><h2 id="\u7ED3\u675F" tabindex="-1">\u7ED3\u675F <a class="header-anchor" href="#\u7ED3\u675F" aria-hidden="true">#</a></h2><p>\u4E0A\u6587\u53EA\u662F\u5927\u81F4\u5B9E\u73B0\u4E86\u4E00\u4E2A\u6781\u7B80\u7248single-spa\uFF0C\u4E0D\u96BE\u770B\u51FA\uFF0C\u5176\u672C\u8D28\u4E0A\u662F\u4E00\u4E2A\u52A0\u8F7D\u5668\uFF08\u63A7\u5236\u5B50\u5E94\u7528\u52A0\u8F7D\u3001\u5378\u8F7D\u7B49\u529F\u80FD\u7684\u5E94\u7528\uFF09\u548C\u72B6\u6001\u673A\uFF08\u66F4\u6539\u5E94\u7528\u72B6\u6001\uFF09\u7684\u7ED3\u5408\u4F53\u3002\u5728\u9879\u76EE\u4E2D\uFF0C\u5F80\u5F80\u8FD8\u9700\u8981\u914D\u5408single-spa-vue\u6765\u4F7F\u7528\uFF0C\u4E0B\u4E00\u7BC7\u6587\u7AE0\u6211\u5C06\u7B80\u5355\u5B9E\u73B0\u4E00\u4E0Bsingle-spa-vue\u7684\u529F\u80FD\u3002</p>`,22),e=[o];function c(u,l,k,i,r,d){return a(),s("div",null,e)}var h=n(t,[["render",c]]);export{w as __pageData,h as default};
