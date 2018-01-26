import add from "../module/add"

var page = {},
	/*提现页面模板添加*/
	pageTpl = require('../templates/test.tpl');



page.init = function() {
	/*同步输出提现页页面结构，密码控件结构*/
	var html = pageTpl();
	// $("#content").html(html);
}

page.init();