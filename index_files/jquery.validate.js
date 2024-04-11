/*!
 * jQuery Validation Plugin v1.12.0
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2014 Jörn Zaefferer
 * Released under the MIT license
 */
!function($){$.extend($.fn,{validate:function(options){if(this.length){var validator=$.data(this[0],"validator");return validator||(this.attr("novalidate","novalidate"),validator=new $.validator(options,this[0]),$.data(this[0],"validator",validator),validator.settings.onsubmit&&(this.validateDelegate(":submit","click",(function(event){validator.settings.submitHandler&&(validator.submitButton=event.target),$(event.target).hasClass("cancel")&&(validator.cancelSubmit=!0),void 0!==$(event.target).attr("formnovalidate")&&(validator.cancelSubmit=!0)})),this.submit((function(event){function handle(){var hidden;return!validator.settings.submitHandler||(validator.submitButton&&(hidden=$("<input type='hidden'/>").attr("name",validator.submitButton.name).val($(validator.submitButton).val()).appendTo(validator.currentForm)),validator.settings.submitHandler.call(validator,validator.currentForm,event),validator.submitButton&&hidden.remove(),!1)}return validator.settings.debug&&event.preventDefault(),validator.cancelSubmit?(validator.cancelSubmit=!1,handle()):validator.form()?validator.pendingRequest?(validator.formSubmitted=!0,!1):handle():(validator.focusInvalid(),!1)}))),validator)}options&&options.debug&&window.console&&console.warn("Nothing selected, can't validate, returning nothing.")},valid:function(){var valid,validator;return $(this[0]).is("form")?valid=this.validate().form():(valid=!0,validator=$(this[0].form).validate(),this.each((function(){valid=validator.element(this)&&valid}))),valid},removeAttrs:function(attributes){var result={},$element=this;return $.each(attributes.split(/\s/),(function(index,value){result[value]=$element.attr(value),$element.removeAttr(value)})),result},rules:function(command,argument){var settings,staticRules,existingRules,data,param,filtered,element=this[0];if(command)switch(staticRules=(settings=$.data(element.form,"validator").settings).rules,existingRules=$.validator.staticRules(element),command){case"add":$.extend(existingRules,$.validator.normalizeRule(argument)),delete existingRules.messages,staticRules[element.name]=existingRules,argument.messages&&(settings.messages[element.name]=$.extend(settings.messages[element.name],argument.messages));break;case"remove":return argument?(filtered={},$.each(argument.split(/\s/),(function(index,method){filtered[method]=existingRules[method],delete existingRules[method],"required"===method&&$(element).removeAttr("aria-required")})),filtered):(delete staticRules[element.name],existingRules)}return(data=$.validator.normalizeRules($.extend({},$.validator.classRules(element),$.validator.attributeRules(element),$.validator.dataRules(element),$.validator.staticRules(element)),element)).required&&(param=data.required,delete data.required,data=$.extend({required:param},data),$(element).attr("aria-required","true")),data.remote&&(param=data.remote,delete data.remote,data=$.extend(data,{remote:param})),data}}),$.extend($.expr[":"],{blank:function(a){return!$.trim(""+$(a).val())},filled:function(a){return!!$.trim(""+$(a).val())},unchecked:function(a){return!$(a).prop("checked")}}),$.validator=function(options,form){this.settings=$.extend(!0,{},$.validator.defaults,options),this.currentForm=form,this.init()},$.validator.format=function(source,params){return 1===arguments.length?function(){var args=$.makeArray(arguments);return args.unshift(source),$.validator.format.apply(this,args)}:(arguments.length>2&&params.constructor!==Array&&(params=$.makeArray(arguments).slice(1)),params.constructor!==Array&&(params=[params]),$.each(params,(function(i,n){source=source.replace(new RegExp("\\{"+i+"\\}","g"),(function(){return n}))})),source)},$.extend($.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusInvalid:!0,errorContainer:$([]),errorLabelContainer:$([]),onsubmit:!0,ignore:":hidden",ignoreTitle:!1,onfocusin:function(element){this.lastActive=element,this.settings.focusCleanup&&!this.blockFocusCleanup&&(this.settings.unhighlight&&this.settings.unhighlight.call(this,element,this.settings.errorClass,this.settings.validClass),this.addWrapper(this.errorsFor(element)).hide())},onfocusout:function(element){this.checkable(element)||!(element.name in this.submitted)&&this.optional(element)||this.element(element)},onkeyup:function(element,event){9===event.which&&""===this.elementValue(element)||(element.name in this.submitted||element===this.lastElement)&&this.element(element)},onclick:function(element){element.name in this.submitted?this.element(element):element.parentNode.name in this.submitted&&this.element(element.parentNode)},highlight:function(element,errorClass,validClass){"radio"===element.type?this.findByName(element.name).addClass(errorClass).removeClass(validClass):$(element).addClass(errorClass).removeClass(validClass)},unhighlight:function(element,errorClass,validClass){"radio"===element.type?this.findByName(element.name).removeClass(errorClass).addClass(validClass):$(element).removeClass(errorClass).addClass(validClass)}},setDefaults:function(settings){$.extend($.validator.defaults,settings)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",maxlength:$.validator.format("Please enter no more than {0} characters."),minlength:$.validator.format("Please enter at least {0} characters."),rangelength:$.validator.format("Please enter a value between {0} and {1} characters long."),range:$.validator.format("Please enter a value between {0} and {1}."),max:$.validator.format("Please enter a value less than or equal to {0}."),min:$.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:!1,prototype:{init:function(){this.labelContainer=$(this.settings.errorLabelContainer),this.errorContext=this.labelContainer.length&&this.labelContainer||$(this.currentForm),this.containers=$(this.settings.errorContainer).add(this.settings.errorLabelContainer),this.submitted={},this.valueCache={},this.pendingRequest=0,this.pending={},this.invalid={},this.reset();var rules,groups=this.groups={};function delegate(event){var validator=$.data(this[0].form,"validator"),eventType="on"+event.type.replace(/^validate/,""),settings=validator.settings;settings[eventType]&&!this.is(settings.ignore)&&settings[eventType].call(validator,this[0],event)}$.each(this.settings.groups,(function(key,value){"string"==typeof value&&(value=value.split(/\s/)),$.each(value,(function(index,name){groups[name]=key}))})),rules=this.settings.rules,$.each(rules,(function(key,value){rules[key]=$.validator.normalizeRule(value)})),$(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ","focusin focusout keyup",delegate).validateDelegate("[type='radio'], [type='checkbox'], select, option","click",delegate),this.settings.invalidHandler&&$(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler),$(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required","true")},form:function(){return this.checkForm(),$.extend(this.submitted,this.errorMap),this.invalid=$.extend({},this.errorMap),this.valid()||$(this.currentForm).triggerHandler("invalid-form",[this]),this.showErrors(),this.valid()},checkForm:function(){this.prepareForm();for(var i=0,elements=this.currentElements=this.elements();elements[i];i++)this.check(elements[i]);return this.valid()},element:function(element){var cleanElement=this.clean(element),checkElement=this.validationTargetFor(cleanElement),result=!0;return this.lastElement=checkElement,void 0===checkElement?delete this.invalid[cleanElement.name]:(this.prepareElement(checkElement),this.currentElements=$(checkElement),(result=!1!==this.check(checkElement))?delete this.invalid[checkElement.name]:this.invalid[checkElement.name]=!0),$(element).attr("aria-invalid",!result),this.numberOfInvalids()||(this.toHide=this.toHide.add(this.containers)),this.showErrors(),result},showErrors:function(errors){if(errors){for(var name in $.extend(this.errorMap,errors),this.errorList=[],errors)this.errorList.push({message:errors[name],element:this.findByName(name)[0]});this.successList=$.grep(this.successList,(function(element){return!(element.name in errors)}))}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){$.fn.resetForm&&$(this.currentForm).resetForm(),this.submitted={},this.lastElement=null,this.prepareForm(),this.hideErrors(),this.elements().removeClass(this.settings.errorClass).removeData("previousValue").removeAttr("aria-invalid")},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(obj){var i,count=0;for(i in obj)count++;return count},hideErrors:function(){this.addWrapper(this.toHide).hide()},valid:function(){return 0===this.size()},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{$(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(e){}},findLastActive:function(){var lastActive=this.lastActive;return lastActive&&1===$.grep(this.errorList,(function(n){return n.element.name===lastActive.name})).length&&lastActive},elements:function(){var validator=this,rulesCache={};return $(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter((function(){return!this.name&&validator.settings.debug&&window.console&&console.error("%o has no name assigned",this),!(this.name in rulesCache||!validator.objectLength($(this).rules()))&&(rulesCache[this.name]=!0,!0)}))},clean:function(selector){return $(selector)[0]},errors:function(){var errorClass=this.settings.errorClass.split(" ").join(".");return $(this.settings.errorElement+"."+errorClass,this.errorContext)},reset:function(){this.successList=[],this.errorList=[],this.errorMap={},this.toShow=$([]),this.toHide=$([]),this.currentElements=$([])},prepareForm:function(){this.reset(),this.toHide=this.errors().add(this.containers)},prepareElement:function(element){this.reset(),this.toHide=this.errorsFor(element)},elementValue:function(element){var val,$element=$(element),type=$element.attr("type");return"radio"===type||"checkbox"===type?$("input[name='"+$element.attr("name")+"']:checked").val():"string"==typeof(val=$element.val())?val.replace(/\r/g,""):val},check:function(element){element=this.validationTargetFor(this.clean(element));var result,method,rule,rules=$(element).rules(),rulesCount=$.map(rules,(function(n,i){return i})).length,dependencyMismatch=!1,val=this.elementValue(element);for(method in rules){rule={method:method,parameters:rules[method]};try{if("dependency-mismatch"===(result=$.validator.methods[method].call(this,val,element,rule.parameters))&&1===rulesCount){dependencyMismatch=!0;continue}if(dependencyMismatch=!1,"pending"===result)return void(this.toHide=this.toHide.not(this.errorsFor(element)));if(!result)return this.formatAndAdd(element,rule),!1}catch(e){throw this.settings.debug&&window.console&&console.log("Exception occurred when checking element "+element.id+", check the '"+rule.method+"' method.",e),e}}if(!dependencyMismatch)return this.objectLength(rules)&&this.successList.push(element),!0},customDataMessage:function(element,method){return $(element).data("msg"+method[0].toUpperCase()+method.substring(1).toLowerCase())||$(element).data("msg")},customMessage:function(name,method){var m=this.settings.messages[name];return m&&(m.constructor===String?m:m[method])},findDefined:function(){for(var i=0;i<arguments.length;i++)if(void 0!==arguments[i])return arguments[i]},defaultMessage:function(element,method){return this.findDefined(this.customMessage(element.name,method),this.customDataMessage(element,method),!this.settings.ignoreTitle&&element.title||void 0,$.validator.messages[method],"<strong>Warning: No message defined for "+element.name+"</strong>")},formatAndAdd:function(element,rule){var message=this.defaultMessage(element,rule.method),theregex=/\$?\{(\d+)\}/g;"function"==typeof message?message=message.call(this,rule.parameters,element):theregex.test(message)&&(message=$.validator.format(message.replace(theregex,"{$1}"),rule.parameters)),this.errorList.push({message:message,element:element,method:rule.method}),this.errorMap[element.name]=message,this.submitted[element.name]=message},addWrapper:function(toToggle){return this.settings.wrapper&&(toToggle=toToggle.add(toToggle.parent(this.settings.wrapper))),toToggle},defaultShowErrors:function(){var i,elements,error;for(i=0;this.errorList[i];i++)error=this.errorList[i],this.settings.highlight&&this.settings.highlight.call(this,error.element,this.settings.errorClass,this.settings.validClass),this.showLabel(error.element,error.message);if(this.errorList.length&&(this.toShow=this.toShow.add(this.containers)),this.settings.success)for(i=0;this.successList[i];i++)this.showLabel(this.successList[i]);if(this.settings.unhighlight)for(i=0,elements=this.validElements();elements[i];i++)this.settings.unhighlight.call(this,elements[i],this.settings.errorClass,this.settings.validClass);this.toHide=this.toHide.not(this.toShow),this.hideErrors(),this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return $(this.errorList).map((function(){return this.element}))},showLabel:function(element,message){var label=this.errorsFor(element);label.length?(label.removeClass(this.settings.validClass).addClass(this.settings.errorClass),label.html(message)):(label=$("<"+this.settings.errorElement+">").attr("for",this.idOrName(element)).addClass(this.settings.errorClass).html(message||""),this.settings.wrapper&&(label=label.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()),this.labelContainer.append(label).length||(this.settings.errorPlacement?this.settings.errorPlacement(label,$(element)):label.insertAfter(element))),!message&&this.settings.success&&(label.text(""),"string"==typeof this.settings.success?label.addClass(this.settings.success):this.settings.success(label,element)),this.toShow=this.toShow.add(label)},errorsFor:function(element){var name=this.idOrName(element);return this.errors().filter((function(){return $(this).attr("for")===name}))},idOrName:function(element){return this.groups[element.name]||(this.checkable(element)?element.name:element.id||element.name)},validationTargetFor:function(element){return this.checkable(element)&&(element=this.findByName(element.name).not(this.settings.ignore)[0]),element},checkable:function(element){return/radio|checkbox/i.test(element.type)},findByName:function(name){return $(this.currentForm).find("[name='"+name+"']")},getLength:function(value,element){switch(element.nodeName.toLowerCase()){case"select":return $("option:selected",element).length;case"input":if(this.checkable(element))return this.findByName(element.name).filter(":checked").length}return value.length},depend:function(param,element){return!this.dependTypes[typeof param]||this.dependTypes[typeof param](param,element)},dependTypes:{boolean:function(param){return param},string:function(param,element){return!!$(param,element.form).length},function:function(param,element){return param(element)}},optional:function(element){var val=this.elementValue(element);return!$.validator.methods.required.call(this,val,element)&&"dependency-mismatch"},startRequest:function(element){this.pending[element.name]||(this.pendingRequest++,this.pending[element.name]=!0)},stopRequest:function(element,valid){this.pendingRequest--,this.pendingRequest<0&&(this.pendingRequest=0),delete this.pending[element.name],valid&&0===this.pendingRequest&&this.formSubmitted&&this.form()?($(this.currentForm).submit(),this.formSubmitted=!1):!valid&&0===this.pendingRequest&&this.formSubmitted&&($(this.currentForm).triggerHandler("invalid-form",[this]),this.formSubmitted=!1)},previousValue:function(element){return $.data(element,"previousValue")||$.data(element,"previousValue",{old:null,valid:!0,message:this.defaultMessage(element,"remote")})}},classRuleSettings:{required:{required:!0},email:{email:!0},url:{url:!0},date:{date:!0},dateISO:{dateISO:!0},number:{number:!0},digits:{digits:!0},creditcard:{creditcard:!0}},addClassRules:function(className,rules){className.constructor===String?this.classRuleSettings[className]=rules:$.extend(this.classRuleSettings,className)},classRules:function(element){var rules={},classes=$(element).attr("class");return classes&&$.each(classes.split(" "),(function(){this in $.validator.classRuleSettings&&$.extend(rules,$.validator.classRuleSettings[this])})),rules},attributeRules:function(element){var method,value,rules={},$element=$(element),type=element.getAttribute("type");for(method in $.validator.methods)"required"===method?(""===(value=element.getAttribute(method))&&(value=!0),value=!!value):value=$element.attr(method),/min|max/.test(method)&&(null===type||/number|range|text/.test(type))&&(value=Number(value)),value||0===value?rules[method]=value:type===method&&"range"!==type&&(rules[method]=!0);return rules.maxlength&&/-1|2147483647|524288/.test(rules.maxlength)&&delete rules.maxlength,rules},dataRules:function(element){var method,value,rules={},$element=$(element);for(method in $.validator.methods)void 0!==(value=$element.data("rule"+method[0].toUpperCase()+method.substring(1).toLowerCase()))&&(rules[method]=value);return rules},staticRules:function(element){var rules={},validator=$.data(element.form,"validator");return validator.settings.rules&&(rules=$.validator.normalizeRule(validator.settings.rules[element.name])||{}),rules},normalizeRules:function(rules,element){return $.each(rules,(function(prop,val){if(!1!==val){if(val.param||val.depends){var keepRule=!0;switch(typeof val.depends){case"string":keepRule=!!$(val.depends,element.form).length;break;case"function":keepRule=val.depends.call(element,element)}keepRule?rules[prop]=void 0===val.param||val.param:delete rules[prop]}}else delete rules[prop]})),$.each(rules,(function(rule,parameter){rules[rule]=$.isFunction(parameter)?parameter(element):parameter})),$.each(["minlength","maxlength"],(function(){rules[this]&&(rules[this]=Number(rules[this]))})),$.each(["rangelength","range"],(function(){var parts;rules[this]&&($.isArray(rules[this])?rules[this]=[Number(rules[this][0]),Number(rules[this][1])]:"string"==typeof rules[this]&&(parts=rules[this].split(/[\s,]+/),rules[this]=[Number(parts[0]),Number(parts[1])]))})),$.validator.autoCreateRanges&&(rules.min&&rules.max&&(rules.range=[rules.min,rules.max],delete rules.min,delete rules.max),rules.minlength&&rules.maxlength&&(rules.rangelength=[rules.minlength,rules.maxlength],delete rules.minlength,delete rules.maxlength)),rules},normalizeRule:function(data){if("string"==typeof data){var transformed={};$.each(data.split(/\s/),(function(){transformed[this]=!0})),data=transformed}return data},addMethod:function(name,method,message){$.validator.methods[name]=method,$.validator.messages[name]=void 0!==message?message:$.validator.messages[name],method.length<3&&$.validator.addClassRules(name,$.validator.normalizeRule(name))},methods:{required:function(value,element,param){if(!this.depend(param,element))return"dependency-mismatch";if("select"===element.nodeName.toLowerCase()){var val=$(element).val();return val&&val.length>0}return this.checkable(element)?this.getLength(value,element)>0:$.trim(value).length>0},email:function(value,element){return this.optional(element)||/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)},url:function(value,element){return this.optional(element)||/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value)},date:function(value,element){return this.optional(element)||!/Invalid|NaN/.test(new Date(value).toString())},dateISO:function(value,element){return this.optional(element)||/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value)},number:function(value,element){return this.optional(element)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)},digits:function(value,element){return this.optional(element)||/^\d+$/.test(value)},creditcard:function(value,element){if(this.optional(element))return"dependency-mismatch";if(/[^0-9 \-]+/.test(value))return!1;var n,cDigit,nCheck=0,nDigit=0,bEven=!1;if((value=value.replace(/\D/g,"")).length<13||value.length>19)return!1;for(n=value.length-1;n>=0;n--)cDigit=value.charAt(n),nDigit=parseInt(cDigit,10),bEven&&(nDigit*=2)>9&&(nDigit-=9),nCheck+=nDigit,bEven=!bEven;return nCheck%10==0},minlength:function(value,element,param){var length=$.isArray(value)?value.length:this.getLength($.trim(value),element);return this.optional(element)||length>=param},maxlength:function(value,element,param){var length=$.isArray(value)?value.length:this.getLength($.trim(value),element);return this.optional(element)||length<=param},rangelength:function(value,element,param){var length=$.isArray(value)?value.length:this.getLength($.trim(value),element);return this.optional(element)||length>=param[0]&&length<=param[1]},min:function(value,element,param){return this.optional(element)||value>=param},max:function(value,element,param){return this.optional(element)||value<=param},range:function(value,element,param){return this.optional(element)||value>=param[0]&&value<=param[1]},equalTo:function(value,element,param){var target=$(param);return this.settings.onfocusout&&target.unbind(".validate-equalTo").bind("blur.validate-equalTo",(function(){$(element).valid()})),value===target.val()},remote:function(value,element,param){if(this.optional(element))return"dependency-mismatch";var validator,data,previous=this.previousValue(element);return this.settings.messages[element.name]||(this.settings.messages[element.name]={}),previous.originalMessage=this.settings.messages[element.name].remote,this.settings.messages[element.name].remote=previous.message,param="string"==typeof param&&{url:param}||param,previous.old===value?previous.valid:(previous.old=value,validator=this,this.startRequest(element),(data={})[element.name]=value,$.ajax($.extend(!0,{url:param,mode:"abort",port:"validate"+element.name,dataType:"json",data:data,context:validator.currentForm,success:function(response){var errors,message,submitted,valid=!0===response||"true"===response;validator.settings.messages[element.name].remote=previous.originalMessage,valid?(submitted=validator.formSubmitted,validator.prepareElement(element),validator.formSubmitted=submitted,validator.successList.push(element),delete validator.invalid[element.name],validator.showErrors()):(errors={},message=response||validator.defaultMessage(element,"remote"),errors[element.name]=previous.message=$.isFunction(message)?message(value):message,validator.invalid[element.name]=!0,validator.showErrors(errors)),previous.valid=valid,validator.stopRequest(element,valid)}},param)),"pending")}}}),$.format=function(){throw"$.format has been deprecated. Please use $.validator.format instead."}}(jQuery),function($){var ajax,pendingRequests={};$.ajaxPrefilter?$.ajaxPrefilter((function(settings,_,xhr){var port=settings.port;"abort"===settings.mode&&(pendingRequests[port]&&pendingRequests[port].abort(),pendingRequests[port]=xhr)})):(ajax=$.ajax,$.ajax=function(settings){var mode=("mode"in settings?settings:$.ajaxSettings).mode,port=("port"in settings?settings:$.ajaxSettings).port;return"abort"===mode?(pendingRequests[port]&&pendingRequests[port].abort(),pendingRequests[port]=ajax.apply(this,arguments),pendingRequests[port]):ajax.apply(this,arguments)})}(jQuery),function($){$.extend($.fn,{validateDelegate:function(delegate,type,handler){return this.bind(type,(function(event){var target=$(event.target);if(target.is(delegate))return handler.apply(target,arguments)}))}})}(jQuery);