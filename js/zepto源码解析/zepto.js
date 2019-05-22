/* Zepto v1.1.6 - zepto event ajax form ie - zeptojs.com/license */

var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
    document = window.document,//用变量缓存document对象
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div'),
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
    isArray = Array.isArray ||
      function(object){ return object instanceof Array }
  /**
   * matches：精确匹配
   * @param element: element对象
   * @param selector: 选择器
   * @returns {*}
   */
  /**
   *matches
   * 英 [ˈmætʃɪz]   美 [ˈmætʃɪz]
   * n.
   * 火柴;比赛;竞赛;敌手;旗鼓相当的人
   * v.
   * 般配;相配;相同;相似;相一致;找相称(或相关)的人(或物);配对
   * match的第三人称单数和复数
   */
  zepto.matches = function(element, selector) {
    /**
     * 如果选择器不存在空或element不存在或element的nodeType不为1，则返回
     * */
    if (!selector || !element || element.nodeType !== 1) return false
    /**
     * 得到element精确选择器
     * @type {((selectors: string) => boolean) | *}
     */
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector;
    /**
     * 精确匹配选择器存在,返回精确匹配结果
     */
    if (matchesSelector) return matchesSelector.call(element, selector);
    // fall back to performing a selector:
    /**
     * 新建元素父对象，临时对象不等于父对象
     * */
    var match, parent = element.parentNode, temp = !parent;
    /**
     * 如果temp存在，为temp指定一个div作为父节点，并将element对象添加进入父对象
     * */
    if (temp) (parent = tempParent).appendChild(element);
    /**
     * 调用匹配函数对象
     * 调用匹配函数对象，并查找element对象
     * */
    match = ~zepto.qsa(parent, selector).indexOf(element);
    /**
     * 删除element子对象
     * */
    temp && tempParent.removeChild(element);
    return match
  };

  function type(obj) {
    /**
     * 如果对象为空，将空对象转化为String对象，
     * 如果传入的obj不为空，对象toString,
     * 类转化为类型如果不能转化返回为"object"
     * */
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }
 /**
  * 是否为方法
  * */
  function isFunction(value) { return type(value) == "function" }
  /**
   * 是否为window对象
   * */
  function isWindow(obj)     { return obj != null && obj == obj.window }
  /**
   * 是否是Document对象
   * */
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  /**
   * 是否为对象
   * */
  function isObject(obj)     { return type(obj) == "object" }
  /**
   * 是否为原型对象
   * */
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }
  //如果是类数组
  function likeArray(obj) { return typeof obj.length == 'number' }
  //去除数组中空对象
  function compact(array) { return filter.call(array, function(item){ return item != null }) }

  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  //去重
    /**
     * 结合数组的filter方法，
     * 查看数组的某项出现的索引是不是与idx相等，
     * 不相等，肯定出现过2次以上，即将其过滤掉。
     * 其实结合es6中的Set数据结构，可以很方便的做到数组去重。
     * */
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

    /**
     * class正则校验
     * @param name
     * @returns {RegExp}
     */
  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }
  /**
   * 或许被添加Px
   * */
  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }
  /**
   * 默认显示
   * param:nodeName
   * */
  function defaultDisplay(nodeName) {
    var element, display;
    /**
     * 如果elementDisplay没有nodeName不存在
     * */
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName);//创建element对象
      document.body.appendChild(element);//将element对象添加到body中
        /**
         *Window.getComputedStyle()方法返回一个对象，
         * 该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值。
         * 私有的CSS属性值可以通过对象提供的API或通过简单地使用CSS属性名称进行索引来访问。
         * 语法节
         * let style = window.getComputedStyle(element, [pseudoElt]);
         * element
         * 用于获取计算样式的Element。
         * pseudoElt 可选
         * 指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）。
         * 注意：在Gecko2.0 (Firefox 4 / Thunderbird 3.3 / SeaMonkey 2.1)之前版本，参数pseudoElt是必要的。
         * 如果为null，则不指定其他主要浏览器必须指定此参数。Gecko已经更改为匹配其他浏览器的行为。
         * 返回的style是一个实时的 CSSStyleDeclaration 对象，当元素的样式更改时，它会自动更新本身。
         * */
        /**
         * 得到display属性值
         * */
      display = getComputedStyle(element, '').getPropertyValue("display");
      /**
       * 得到element父对象删除子对象
       * */
      element.parentNode.removeChild(element);
      /**
       * 如果为none，display赋值为block
       * */
      display == "none" && (display = "block");
      /**
       * 为elementDisplay空对象的nodeName属性赋值
       * */
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName];//如果存在则放回nodeName对应的值
  }
  /**
   *得到子对象
   * */
  function children(element) {
    /**
     * slice() 方法可从已有的数组中返回选定的元素。
     * 语法
     * arrayObject.slice(start,end)
     * 参数	描述
     * start	必需。规定从何处开始选取。如果是负数，那么它规定从数组尾部开始算起的位置。
     * 也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推。
     * end	可选。规定从何处结束选取。该参数是数组片断结束处的数组下标。
     * 如果没有指定该参数，那么切分的数组包含从 start 到数组结束的所有元素。
     * 如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。
     * 返回值
     * 返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。
     * 说明
     * 请注意，该方法并不会修改数组，而是返回一个子数组。如果想删除数组中的一段元素，应该使用方法 Array.splice()。
     * 提示和注释
     * 注释：您可使用负值从数组的尾部选取元素。
     * 注释：如果 end 未被规定，那么 slice() 方法会选取从 start 到数组结尾的所有元素。
     * */
      /**
       * 如果对象中含有children属性，返回对象中的children属性对象，否则的到所有子对象列表的nodeType为1的对象
       * */
      /**
       * nodeType 属性返回以数字值返回指定节点的节点类型。
       * 如果节点是元素节点，则 nodeType 属性将返回 1。
       * 如果节点是属性节点，则 nodeType 属性将返回 2。
       * */
      /**
       *NodeType	Named Constant
       * 1	ELEMENT_NODE
       * 2	ATTRIBUTE_NODE
       * 3	TEXT_NODE
       * 4	CDATA_SECTION_NODE
       * 5	ENTITY_REFERENCE_NODE
       * 6	ENTITY_NODE
       * 7	PROCESSING_INSTRUCTION_NODE
       * 8	COMMENT_NODE
       * 9	DOCUMENT_NODE
       * 10	DOCUMENT_TYPE_NODE
       * 11	DOCUMENT_FRAGMENT_NODE
       * 12	NOTATION_NODE
       * */
      return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
    /**
     *fragment
     * 英[ˈfræɡmənt , fræɡˈment]
     * 美[ˈfræɡmənt , fræɡˈment]
     * n.	碎片; 片段;
     * v.	(使) 碎裂，破裂，分裂;
     * */
     /**
      * takes
      * 英 [teɪks]   美 [teɪks]
      * v.
      * 携带;拿走;取走;运走;带去;引领;使达到，把…推向，把…带到(另一个层次、层面等)
      * take的第三人称单数
      * */
     /**
      * optional
      * 英 [ˈɒpʃənl]   美 [ˈɑːpʃənl]
      * adj.
      * 可选择的;选修的
      * 记忆技巧：option 选择 + al …的 → 可选择的
      * */
  // to generate DOM nodes nodes from the given html string.
     /**
      * 英 [ˈdʒenəreɪt] 美 [ˈdʒɛnəˌret]
      * vt. 形成，造成；产生物理反应；产生（后代）；引起
      * 网 络
      * 产生； 生成； 发生； 引起 过去式：
      * generated 过去分词：generated
      * 现在分词：generating
      * 第三人称单数：generates
      * */
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
     /**
      * overridden生词本 低频词，记不记随你啦！
      * 英 [ˌəʊvə'rɪdn] 美 [ˌoʊvə'rɪdn]
      * v. 越控( override的过去分词 )；
      * （以权力）否决；优先于；比…更重要
      * 网 络
      * 被覆盖； 践踏； 覆写； 凌越
      * */
  // it compatible with browsers that don't support the DOM fully.
     /**
      * 英 [kəmˈpætəbl]
      * 美 [kəmˈpætəbəl]
      * adj. 兼容的，相容的；和谐的，协调的；
      * [生物学]亲和的；可以并存的，能共处的
      * 网 络
      * 兼容； 兼容的； 相容； 兼容模式
      * */
     /**
      * fully生词本 高频词
      * 英 [ˈfʊli] 美 [ˈfʊli]
      * adv. 充分地；完全地；足足；彻底地
      * 网 络
      * 完全； 完全地； 充分； 充分地
      * */
  zepto.fragment = function(html, name, properties) {
    /**
     * 定义dom对象变量，节点集合对象和容器对象
     * */
      var dom, nodes, container;

    // A special case optimization for a single tag
      /**
       * 高频词
       * 英 [ˈspeʃl] 美 [ˈspɛʃəl]
       * adj. 特殊的；专门的；专用的；重要的
       * n. 专车；特价；特刊；特约稿
       * 网 络
       * 特殊； 特别； 特别的；
       * 专题 复数：specials
       * 比较级：more special
       * 最高级：most special
       * */
      /**
       * optimization
       * 英 [ˌɒptɪmaɪ'zeɪʃən] 美 [ˌɑptəmɪˈzeʃən]
       * n. 最佳化，最优化；优选法；优化组合
       * 网 络
       * 优化； 最佳化； 最优化； 优化问题
       * */
      /**
       * 验证是否为单个标记，根据表达式创建element对象
       * */
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));
   //如果dom存在
    if (!dom) {
        /**
         * 如果传入的html有replace属性，则对html进行替换
         * */
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
      //如果name没定义，则测试html为name赋值
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
      //如果name不在容器中，name为'*';
      if (!(name in containers)) name = '*';
      //下面语句，name就在containers中。
      container = containers[name];//得到对应容器对象
      container.innerHTML = '' + html;//容器插入html
        //取出所有子容器并遍历删除
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }
     //如果属性在原型对象中
    if (isPlainObject(properties)) {
      nodes = $(dom);//找到节点集合
        //遍历原型中的属性
      $.each(properties, function(key, value) {
          //如果方法属性包含了这个key,则节点集合中取得此key的value值
        if (methodAttributes.indexOf(key) > -1) nodes[key](value);
        else nodes.attr(key, value);//如果不含有，为此ke赋值
      })
    }

    return dom//返回dom
  };

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
    /**
     * swaps中频词,[swɔps]
     n. 交换( swap的名词复数 )；
     交换物，被掉换者 v. 交换（工作）( swap的第三人称单数 )；
     用…替换，把…换成，掉换（过来）
     网 络
     互换合约； 互换交易； 互换协议； 金融互换
     * */
  // of nodes with `$.fn` and thus supplying all the Zepto functions
    /**
     * thus生词本 高频词
     * 英 [ðʌs] 美 [ðʌs]
     * adv. 于是，因此；如此，这样，像这样，
     * 例如；到这程度，到这地步，这么；如下
     * conj. 因此
     * 网 络
     * 因而； 因此； 从而； 如此
     * */
    /**
     * supplying 高频词[səˈplaiŋ]
     * v. 供给( supply的现在分词 )；
     * 补充；弥补（缺陷、损失等）；向…提供（物资等）
     * 网 络
     * 作为航天； 提供格式条款； 信息保障； 提供格式
     * */
  // to the array. Note that `__proto__` is not supported on Internet
    /**
     * supported生词本 高频词
     * 英 [sə'pɔ:tɪd]
     * 美 [sə'pɔtɪd]
     * v. 支持( support的过去式和过去分词 )；帮助；支撑；维持
     * 网 络
     * 负载； 支； 支承的； 负载型
     * */
  // Explorer. This method can be overriden in plugins.
    /**
     * overthrow生词本 中频词
     * 英 [ˌəʊvəˈθrəʊ]
     * 美 [ˌoʊvərˈθroʊ]
     * vt. 打倒，推翻；使屈服，征服；使瓦解；撞倒
     * n. 推翻，打倒；打翻；倾倒；[棒]投得过高的球
     * 网 络
     * 推翻； 颠覆； 打倒； 风桥
     * */
  zepto.Z = function(dom, selector) {
    dom = dom || [];
    dom.__proto__ = $.fn;
    dom.selector = selector || '';
    return dom
  };

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
    /**
     * 如果一个对象在Zepto集合中，返回为ture,这个方法在插件中可以覆盖
     * */
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
    /**
     * counterpart 中频词
     * 英 [ˈkaʊntəpɑ:t] 美 [ˈkaʊntərpɑrt]
     * n. 配对物；副本；相对物；极相似的人或物
     * 网 络
     * 副本； 配对物； 对应物； 复本
     * @param selector
     * @param context
     * @returns {*}
     */
  // takes a CSS selector and an optional context (and handles various
    /**
     * takes 高频词
     * [teiks]
     * v. 拿( take的第三人称单数 )；
     * 接受；学习；取得
     * 网 络
     * 取得了； 要花； 需要花； 取景镜头
     * @param selector
     * @param context
     * @returns {*}
     */
    /**
     * optional低频词
     * 英 [ˈɒpʃənl]
     * 美 [ˈɑpʃənl]
     * adj. 可选择的；随意的，任意的；非强制的；选修科目
     * 网 络
     * 可选； 可选择的； 非强制的； 可选的
     * @param selector
     * @param context
     * @returns {*}
     */
    /**
     * context中频词
     * 英 [ˈkɒntekst]
     * 美 [ˈkɑntekst]
     * n. 上下文；背景；环境；语境
     * 网 络
     * 上下文； 语境； 情境； 脉络
     * @param selector
     * @param context
     * @returns {*}
     */
    /**
     * 高频词英 ['hændlz]
     * 美 ['hændlz]
     * n. （织物、毛皮等的）手感( handle的名词复数 )；
     * 手柄；举动；柄状物 v. 操作( handle的第三人称单数 )；
     * 容易╱难以)驾驶；操纵；行动
     * 网 络
     * 控键； 控点； 操作点； 手柄上
     * @param selector
     * @param context
     * @returns {*}
     */
    /**
     * various生词本 高频词，一定要记住哦！英 [ˈveəriəs] 美 [ˈveriəs]
     adj. 各种各样的；多方面的；许多的；各个的，个别的
     网 络
     各种各样的； 不同的； 不同； 多方面
     * @param selector
     * @param context
     * @returns {*}
     */
  // special cases).
    /**
     * special 高频词
     * 英 [ˈspeʃl]
     * 美 [ˈspɛʃəl]
     * adj. 特殊的；专门的；专用的；重要的
     * n. 专车；特价；特刊；特约稿
     * @param selector
     * @param context
     * @returns {*}
     */
    /**
     * cases 中频词
     * 英 [keɪsɪs]
     * 美 [keɪsɪs]
     * n. 案例；病例( case的名词复数 )；
     * （需特别对待或注意的）人；事例；容器
     * 网 络
     * 情况下； 例； 例患者； 患者
     * @param selector
     * @param context
     * @returns {*}
     */
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    var dom;//新建变量dom
    // If nothing given, return an empty Zepto collection
      /**
       * given中频词
       * 英 [ˈgɪvn]
       * 美 [ˈɡɪvən]
       * adj. 指定的，确定的；假设的，假定的；有…倾向的；赠送的
       * prep. （表示原因）考虑到；（表示假设）倘若，假定
       * n. 假设
       * v. 给予，赠送( give的过去分词)
       * 网 络
       * 送给； 给出； 发给； 给定
       * */
      /**
       * 如果没有指定选择器，则返回zepto.Z()；函数
       * */
    if (!selector) return zepto.Z();
    // Optimize for string selectors 优化字符串选择器
        /**
         * Optimize
         * 英 [ˈɒptɪmaɪz]
         * 美 [ˈɑptɪmaɪz]
         * vt. 使最优化，使尽可能有效
         * 网 络
         * 优化编辑器； 最佳化； 优化；
         * 优化服务 过去式：
         * optimized 过去分词：optimized
         * 现在分词：optimizing
         * 第三人称单数：optimizes
         * */
    else if (typeof selector == 'string') {
      selector = selector.trim();
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector);
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector);
    // If a Zepto collection is given, just return it
        /**
         * given中频词
         * 英 [ˈgɪvn]
         * 美 [ˈɡɪvən]
         * adj. 指定的，确定的；假设的，假定的；有…倾向的；赠送的
         * prep. （表示原因）考虑到；（表示假设）倘若，假定
         * n. 假设
         * v. 给予，赠送( give的过去分词)
         * 网 络
         * 送给； 给出； 发给； 给定
         * */
    else if (zepto.isZ(selector)) return selector;
    else {
      // normalize array if an array of nodes is given
        /**
         * normalize
         * 低频词
         * 英 [ˈnɔ:məlaɪz]
         * 美 [ˈnɔrməlaɪz]
         * vt. 使正常化；使标准化
         * 网 络
         * 正火； 使标准化
         * */
      if (isArray(selector)) dom = compact(selector);
      // Wrap DOM nodes.围绕Dom nodes
      else if (isObject(selector)) //选择器是对象
        dom = [selector], selector = null;//得到对象，旋转器清空
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))//测试片段中是否有选择器
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
      // If there's a context, create a collection on that context first, and select
          /**
           * context 中频词
           * 英 [ˈkɒntekst]
           * 美 [ˈkɑntekst]
           * n. 上下文；背景；环境；语境
           * 网 络
           * 上下文； 语境； 情境； 脉络
           * */
          /**
           * collection高频词
           * 英 [kəˈlekʃn]
           * 美 [kəˈlɛkʃən]
           * n. 收集，采集；征收；收藏品；募捐
           * 网 络
           * 集合； 收藏； 托收； 收集物
           * */
      // nodes from there
      else if (context !== undefined) return $(context).find(selector);
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  };

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
    /**
     * makes高频词
     * 英 [meɪks] 美 [meɪks]
     * v. 使( make的第三人称单数 )；成为；做；认为
     * 网 络
     * 使得； 使人； 造就； 进行了
     * */
    /**
     *中频词
     * 英 [ˌɪmplɪmen'teɪʃn]
     * 美 [ˌɪmplɪmənˈteʃən]
     * n. 成就；贯彻；implement的变形；安装启用
     * 网 络
     * 实现； 落实； 执行情况； 推行
     * */
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
    /**
     * patch中频词
     * 英 [pætʃ]
     * 美 [pætʃ]
     * n. 补丁，补片；眼罩；斑点；小块
     * vt. 修补，拼凑；暂时遮掩一下；修理，平息（吵架等）；用美人斑装饰（脸）
     * vi. 打补丁
     * 网 络
     * 补丁； 修补； 面片； 斑块
     * */
  $ = function(selector, context){
    return zepto.init(selector, context)
  };

  function extend(target, source, deep) {
    for (key in source)//遍历原对象
        //如果是深继承并且原对象的对象值是在原型对象或是数组
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
          /**
           * 如果值是在原型对象中，并且目标对象不在原型对象中
           */
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {};//则目标对象设置为空
        if (isArray(source[key]) && !isArray(target[key]))//如果源对象是数组，目标对象不是数组
          target[key] = [];//目标对象置为空数组
        extend(target[key], source[key], deep)//递归调用
      }
      //如果原对象不为undefined，用源对象给目标对象赋值
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
    /**
     * undefined
     * 英 [ˌʌndɪˈfaɪnd]
     * 美 [ˌʌndɪˈfaɪnd]
     * adj. 未阐明的；未限定的
     * 网 络
     * 未定义； 未定义的； 不明确的； 无定义
     * */
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1);//转化为数组得到索引为一个的元素
    if (typeof target == 'boolean') {//如果目标对象为boolean类型
      deep = target;
      target = args.shift();//弹出第一个作为target
    }
    args.forEach(function(arg){ extend(target, arg, deep) });
    return target
  };

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found,
        maybeID = selector[0] == '#',//或许是ID
        maybeClass = !maybeID && selector[0] == '.',//或许是class
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly);
    /**
     * 第一是Document元素，第二是简单选择器，并且是id
     * */
    return (isDocument(element) && isSimple && maybeID) ?
        //如果是得到found的dom元素，并且转化为数组，否则返回空数组
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
        /**
         *1	ELEMENT_NODE
         * 2	ATTRIBUTE_NODE
         * 3	TEXT_NODE
         * 4	CDATA_SECTION_NODE
         * 5	ENTITY_REFERENCE_NODE
         * 6	ENTITY_NODE
         * 7	PROCESSING_INSTRUCTION_NODE
         * 8	COMMENT_NODE
         * 9	DOCUMENT_NODE
         * 10	DOCUMENT_TYPE_NODE
         * 11	DOCUMENT_FRAGMENT_NODE
         * 12	NOTATION_NODE
         * */
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
      slice.call(
        isSimple && !maybeID ?
          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      )
  };

  function filtered(nodes, selector) {
      //如果选择器为空返回$(nodes),否则用选择器过滤$(nodes)
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = document.documentElement.contains ?
    function(parent, node) {
      return parent !== node && parent.contains(node)
    } :
    function(parent, node) {
      while (node && (node = node.parentNode))
        if (node === parent) return true
      return false
    }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className || '',
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          +value + "" == value ? +value :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (!selector) result = $()
      else if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return 0 in arguments ?
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        }) :
        (0 in this ? this[0].innerHTML : null)
    },
    text: function(text){
      return 0 in arguments ?
        this.each(function(idx){
          var newText = funcArg(this, text, idx, this.textContent)
          this.textContent = newText == null ? '' : ''+newText
        }) :
        (0 in this ? this[0].textContent : null)
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && !(1 in arguments)) ?
        (!this.length || this[0].nodeType !== 1 ? undefined :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
        setAttribute(this, attribute)
      }, this)})
    },
    prop: function(name, value){
      name = propMap[name] || name
      return (1 in arguments) ?
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        }) :
        (this[0] && this[0][name])
    },
    data: function(name, value){
      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

      var data = (1 in arguments) ?
        this.attr(attrName, value) :
        this.attr(attrName)

      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return 0 in arguments ?
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        }) :
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
           this[0].value)
        )
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (!this.length) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2) {
        var computedStyle, element = this[0]
        if(!element) return
        computedStyle = getComputedStyle(element, '')
        if (typeof property == 'string')
          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
        else if (isArray(property)) {
          var props = {}
          $.each(property, function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (!name) return false
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      if (!name) return this
      return this.each(function(idx){
        if (!('className' in this)) return
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (!('className' in this)) return
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      if (!name) return this
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    scrollLeft: function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        var parentInDocument = $.contains(document.documentElement, parent)

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          parent.insertBefore(node, target)
          if (parentInDocument) traverseNode(node, function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)

;(function($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (isFunction(data) || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // handle focus(), blur() by calling them directly
      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
      // items in the collection might not be DOM elements
      else if ('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return (0 in arguments) ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

})(Zepto)

;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/,
      originAnchor = document.createElement('a')

  originAnchor.href = window.location.href

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.isDefaultPrevented()
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings, deferred) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    if (deferred) deferred.resolveWith(context, [data, status, xhr])
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings, deferred) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    if (deferred) deferred.rejectWith(context, [xhr, type, error])
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options, deferred){
    if (!('type' in options)) return $.ajax(options)

    var _callbackName = options.jsonpCallback,
      callbackName = ($.isFunction(_callbackName) ?
        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
      script = document.createElement('script'),
      originalCallback = window[callbackName],
      responseData,
      abort = function(errorType) {
        $(script).triggerHandler('error', errorType || 'abort')
      },
      xhr = { abort: abort }, abortTimeout

    if (deferred) deferred.promise(xhr)

    $(script).on('load error', function(e, errorType){
      clearTimeout(abortTimeout)
      $(script).off().remove()

      if (e.type == 'error' || !responseData) {
        ajaxError(null, errorType || 'error', xhr, options, deferred)
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred)
      }

      window[callbackName] = originalCallback
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0])

      originalCallback = responseData = undefined
    })

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return xhr
    }

    window[callbackName] = function(){
      responseData = arguments
    }

    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
    document.head.appendChild(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    // IIS returns Javascript as "application/x-javascript"
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    if (query == '') return url
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data), options.data = undefined
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred(),
        urlAnchor
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) {
      urlAnchor = document.createElement('a')
      urlAnchor.href = settings.url
      urlAnchor.href = urlAnchor.href
      settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
    }

    if (!settings.url) settings.url = window.location.toString()
    serializeData(settings)

    var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
    if (hasPlaceholder) dataType = 'jsonp'

    if (settings.cache === false || (
         (!options || options.cache !== true) &&
         ('script' == dataType || 'jsonp' == dataType)
        ))
      settings.url = appendQuery(settings.url, '_=' + Date.now())

    if ('jsonp' == dataType) {
      if (!hasPlaceholder)
        settings.url = appendQuery(settings.url,
          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
      return $.ajaxJSONP(settings, deferred)
    }

    var mime = settings.accepts[dataType],
        headers = { },
        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(),
        nativeSetHeader = xhr.setRequestHeader,
        abortTimeout

    if (deferred) deferred.promise(xhr)

    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
    setHeader('Accept', mime || '*/*')
    if (mime = settings.mimeType || mime) {
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

    if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
    xhr.setRequestHeader = setHeader

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
          else ajaxSuccess(result, xhr, settings, deferred)
        } else {
          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
        }
      }
    }

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      ajaxError(null, 'abort', xhr, settings, deferred)
      return xhr
    }

    if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async, settings.username, settings.password)

    for (name in headers) nativeSetHeader.apply(xhr, headers[name])

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings, deferred)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    if ($.isFunction(data)) dataType = success, success = data, data = undefined
    if (!$.isFunction(success)) dataType = success, success = undefined
    return {
      url: url
    , data: data
    , success: success
    , dataType: dataType
    }
  }

  $.get = function(/* url, data, success, dataType */){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(/* url, data, success, dataType */){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(/* url, data, success */){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(key, value) {
      if ($.isFunction(value)) value = value()
      if (value == null) value = ""
      this.push(escape(key) + '=' + escape(value))
    }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)

;(function($){
  $.fn.serializeArray = function() {
    var name, type, result = [],
      add = function(value) {
        if (value.forEach) return value.forEach(add)
        result.push({ name: name, value: value })
      }
    if (this[0]) $.each(this[0].elements, function(_, field){
      type = field.type, name = field.name
      if (name && field.nodeName.toLowerCase() != 'fieldset' &&
        !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
        ((type != 'radio' && type != 'checkbox') || field.checked))
          add($(field).val())
    })
    return result
  }

  $.fn.serialize = function(){
    var result = []
    this.serializeArray().forEach(function(elm){
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
    })
    return result.join('&')
  }

  $.fn.submit = function(callback) {
    if (0 in arguments) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.isDefaultPrevented()) this.get(0).submit()
    }
    return this
  }

})(Zepto)

;(function($){
  // __proto__ doesn't exist on IE<11, so redefine
  // the Z function to use object extension instead
  if (!('__proto__' in {})) {
    $.extend($.zepto, {
      Z: function(dom, selector){
        dom = dom || []
        $.extend(dom, $.fn)
        dom.selector = selector || ''
        dom.__Z = true
        return dom
      },
      // this is a kludge but works
      isZ: function(object){
        return $.type(object) === 'array' && '__Z' in object
      }
    })
  }

  // getComputedStyle shouldn't freak out when called
  // without a valid element as argument
  try {
    getComputedStyle(undefined)
  } catch(e) {
    var nativeGetComputedStyle = getComputedStyle;
    window.getComputedStyle = function(element){
      try {
        return nativeGetComputedStyle(element)
      } catch(e) {
        return null
      }
    }
  }
})(Zepto)
