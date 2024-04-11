/*!
 * jQuery Form Plugin
 * version: 3.15 (09-SEP-2012)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses:
 *    http://malsup.github.com/mit-license.txt
 *    http://malsup.github.com/gpl-license-v2.txt
 */
!function($){"use strict";var feature={};function doAjaxSubmit(e){var options=e.data;e.isDefaultPrevented()||(e.preventDefault(),$(this).ajaxSubmit(options))}function captureSubmittingElement(e){var target=e.target,$el=$(target);if(!$el.is(":submit,input:image")){var t=$el.closest(":submit");if(0===t.length)return;target=t[0]}var form=this;if(form.clk=target,"image"==target.type)if(void 0!==e.offsetX)form.clk_x=e.offsetX,form.clk_y=e.offsetY;else if("function"==typeof $.fn.offset){var offset=$el.offset();form.clk_x=e.pageX-offset.left,form.clk_y=e.pageY-offset.top}else form.clk_x=e.pageX-target.offsetLeft,form.clk_y=e.pageY-target.offsetTop;setTimeout((function(){form.clk=form.clk_x=form.clk_y=null}),100)}function log(){if($.fn.ajaxSubmit.debug){var msg="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(msg):window.opera&&window.opera.postError&&window.opera.postError(msg)}}feature.fileapi=void 0!==$("<input type='file'/>").get(0).files,feature.formdata=void 0!==window.FormData,$.fn.ajaxSubmit=function(options){if(!this.length)return log("ajaxSubmit: skipping submit process - no element selected"),this;var method,action,url,$form=this;"function"==typeof options&&(options={success:options}),method=this.attr("method"),(url=(url="string"==typeof(action=this.attr("action"))?$.trim(action):"")||window.location.href||"")&&(url=(url.match(/^([^#]+)/)||[])[1]),options=$.extend(!0,{url:url,success:$.ajaxSettings.success,type:method||"GET",iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},options);var veto={};if(this.trigger("form-pre-serialize",[this,options,veto]),veto.veto)return log("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(options.beforeSerialize&&!1===options.beforeSerialize(this,options))return log("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var traditional=options.traditional;void 0===traditional&&(traditional=$.ajaxSettings.traditional);var qx,elements=[],a=this.formToArray(options.semantic,elements);if(options.data&&(options.extraData=options.data,qx=$.param(options.data,traditional)),options.beforeSubmit&&!1===options.beforeSubmit(a,this,options))return log("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[a,this,options,veto]),veto.veto)return log("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var q=$.param(a,traditional);qx&&(q=q?q+"&"+qx:qx),"GET"==options.type.toUpperCase()?(options.url+=(options.url.indexOf("?")>=0?"&":"?")+q,options.data=null):options.data=q;var callbacks=[];if(options.resetForm&&callbacks.push((function(){$form.resetForm()})),options.clearForm&&callbacks.push((function(){$form.clearForm(options.includeHidden)})),!options.dataType&&options.target){var oldSuccess=options.success||function(){};callbacks.push((function(data){var fn=options.replaceTarget?"replaceWith":"html";$(options.target)[fn](data).each(oldSuccess,arguments)}))}else options.success&&callbacks.push(options.success);options.success=function(data,status,xhr){for(var context=options.context||this,i=0,max=callbacks.length;i<max;i++)callbacks[i].apply(context,[data,status,xhr||$form,$form])};var hasFileInputs=$("input:file:enabled[value]",this).length>0,mp="multipart/form-data",multipart=$form.attr("enctype")==mp||$form.attr("encoding")==mp,fileAPI=feature.fileapi&&feature.formdata;log("fileAPI :"+fileAPI);var shouldUseFrame=(hasFileInputs||multipart)&&!fileAPI;!1!==options.iframe&&(options.iframe||shouldUseFrame)?options.closeKeepAlive?$.get(options.closeKeepAlive,(function(){fileUploadIframe(a)})):fileUploadIframe(a):(hasFileInputs||multipart)&&fileAPI?function(a){for(var formdata=new FormData,i=0;i<a.length;i++)formdata.append(a[i].name,a[i].value);if(options.extraData){var serializedData=function(extraData){var i,part,serialized=$.param(extraData).split("&"),len=serialized.length,result={};for(i=0;i<len;i++)part=serialized[i].split("="),result[decodeURIComponent(part[0])]=decodeURIComponent(part[1]);return result}(options.extraData);for(var p in serializedData)serializedData.hasOwnProperty(p)&&formdata.append(p,serializedData[p])}options.data=null;var s=$.extend(!0,{},$.ajaxSettings,options,{contentType:!1,processData:!1,cache:!1,type:"POST"});options.uploadProgress&&(s.xhr=function(){var xhr=jQuery.ajaxSettings.xhr();return xhr.upload&&(xhr.upload.onprogress=function(event){var percent=0,position=event.loaded||event.position,total=event.total;event.lengthComputable&&(percent=Math.ceil(position/total*100)),options.uploadProgress(event,position,total,percent)}),xhr});s.data=null;var beforeSend=s.beforeSend;s.beforeSend=function(xhr,o){o.data=formdata,beforeSend&&beforeSend.call(this,xhr,o)},$.ajax(s)}(a):$.ajax(options);for(var k=0;k<elements.length;k++)elements[k]=null;return this.trigger("form-submit-notify",[this,options]),this;function fileUploadIframe(a){var el,i,s,g,id,$io,io,xhr,sub,n,timedOut,timeoutHandle,form=$form[0],useProp=!!$.fn.prop;if($(":input[name=submit],:input[id=submit]",form).length)alert('Error: Form elements must not have name or id of "submit".');else{if(a)for(i=0;i<elements.length;i++)el=$(elements[i]),useProp?el.prop("disabled",!1):el.removeAttr("disabled");if((s=$.extend(!0,{},$.ajaxSettings,options)).context=s.context||s,id="jqFormIO"+(new Date).getTime(),s.iframeTarget?(n=($io=$(s.iframeTarget)).attr("name"))?id=n:$io.attr("name",id):($io=$('<iframe name="'+id+'" src="'+s.iframeSrc+'" />')).css({position:"absolute",top:"-1000px",left:"-1000px"}),io=$io[0],xhr={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(status){var e="timeout"===status?"timeout":"aborted";if(log("aborting upload... "+e),this.aborted=1,io.contentWindow.document.execCommand)try{io.contentWindow.document.execCommand("Stop")}catch(ignore){}$io.attr("src",s.iframeSrc),xhr.error=e,s.error&&s.error.call(s.context,xhr,e,status),g&&$.event.trigger("ajaxError",[xhr,s,e]),s.complete&&s.complete.call(s.context,xhr,e)}},(g=s.global)&&0==$.active++&&$.event.trigger("ajaxStart"),g&&$.event.trigger("ajaxSend",[xhr,s]),s.beforeSend&&!1===s.beforeSend.call(s.context,xhr,s))s.global&&$.active--;else if(!xhr.aborted){(sub=form.clk)&&(n=sub.name)&&!sub.disabled&&(s.extraData=s.extraData||{},s.extraData[n]=sub.value,"image"==sub.type&&(s.extraData[n+".x"]=form.clk_x,s.extraData[n+".y"]=form.clk_y));var csrf_token=$("meta[name=csrf-token]").attr("content"),csrf_param=$("meta[name=csrf-param]").attr("content");csrf_param&&csrf_token&&(s.extraData=s.extraData||{},s.extraData[csrf_param]=csrf_token),s.forceSync?doSubmit():setTimeout(doSubmit,10);var data,doc,callbackProcessed,domCheckCount=50,toXml=$.parseXML||function(s,doc){return window.ActiveXObject?((doc=new ActiveXObject("Microsoft.XMLDOM")).async="false",doc.loadXML(s)):doc=(new DOMParser).parseFromString(s,"text/xml"),doc&&doc.documentElement&&"parsererror"!=doc.documentElement.nodeName?doc:null},parseJSON=$.parseJSON||function(s){return window.eval("("+s+")")},httpData=function(xhr,type,s){var ct=xhr.getResponseHeader("content-type")||"",xml="xml"===type||!type&&ct.indexOf("xml")>=0,data=xml?xhr.responseXML:xhr.responseText;return xml&&"parsererror"===data.documentElement.nodeName&&$.error&&$.error("parsererror"),s&&s.dataFilter&&(data=s.dataFilter(data,type)),"string"==typeof data&&("json"===type||!type&&ct.indexOf("json")>=0?data=parseJSON(data):("script"===type||!type&&ct.indexOf("javascript")>=0)&&$.globalEval(data)),data}}}function getDoc(frame){return frame.contentWindow?frame.contentWindow.document:frame.contentDocument?frame.contentDocument:frame.document}function doSubmit(){var t=$form.attr("target"),a=$form.attr("action");form.setAttribute("target",id),method||form.setAttribute("method","POST"),a!=s.url&&form.setAttribute("action",s.url),s.skipEncodingOverride||method&&!/post/i.test(method)||$form.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),s.timeout&&(timeoutHandle=setTimeout((function(){timedOut=!0,cb(1)}),s.timeout));var extraInputs=[];try{if(s.extraData)for(var n in s.extraData)s.extraData.hasOwnProperty(n)&&($.isPlainObject(s.extraData[n])&&s.extraData[n].hasOwnProperty("name")&&s.extraData[n].hasOwnProperty("value")?extraInputs.push($('<input type="hidden" name="'+s.extraData[n].name+'">').attr("value",s.extraData[n].value).appendTo(form)[0]):extraInputs.push($('<input type="hidden" name="'+n+'">').attr("value",s.extraData[n]).appendTo(form)[0]));s.iframeTarget||($io.appendTo("body"),io.attachEvent?io.attachEvent("onload",cb):io.addEventListener("load",cb,!1)),setTimeout((function checkState(){try{var state=getDoc(io).readyState;log("state = "+state),state&&"uninitialized"==state.toLowerCase()&&setTimeout(checkState,50)}catch(e){log("Server abort: ",e," (",e.name,")"),cb(2),timeoutHandle&&clearTimeout(timeoutHandle),timeoutHandle=void 0}}),15),form.submit()}finally{form.setAttribute("action",a),t?form.setAttribute("target",t):$form.removeAttr("target"),$(extraInputs).remove()}}function cb(e){if(!xhr.aborted&&!callbackProcessed){try{doc=getDoc(io)}catch(ex){log("cannot access response document: ",ex),e=2}if(1===e&&xhr)xhr.abort("timeout");else if(2==e&&xhr)xhr.abort("server abort");else if(doc&&doc.location.href!=s.iframeSrc||timedOut){io.detachEvent?io.detachEvent("onload",cb):io.removeEventListener("load",cb,!1);var errMsg,status="success";try{if(timedOut)throw"timeout";var isXml="xml"==s.dataType||doc.XMLDocument||$.isXMLDoc(doc);if(log("isXml="+isXml),!isXml&&window.opera&&(null===doc.body||!doc.body.innerHTML)&&--domCheckCount)return log("requeing onLoad callback, DOM not available"),void setTimeout(cb,250);var docRoot=doc.body?doc.body:doc.documentElement;xhr.responseText=docRoot?docRoot.innerHTML:null,xhr.responseXML=doc.XMLDocument?doc.XMLDocument:doc,isXml&&(s.dataType="xml"),xhr.getResponseHeader=function(header){return{"content-type":s.dataType}[header]},docRoot&&(xhr.status=Number(docRoot.getAttribute("status"))||xhr.status,xhr.statusText=docRoot.getAttribute("statusText")||xhr.statusText);var dt=(s.dataType||"").toLowerCase(),scr=/(json|script|text)/.test(dt);if(scr||s.textarea){var ta=doc.getElementsByTagName("textarea")[0];if(ta)xhr.responseText=ta.value,xhr.status=Number(ta.getAttribute("status"))||xhr.status,xhr.statusText=ta.getAttribute("statusText")||xhr.statusText;else if(scr){var pre=doc.getElementsByTagName("pre")[0],b=doc.getElementsByTagName("body")[0];pre?xhr.responseText=pre.textContent?pre.textContent:pre.innerText:b&&(xhr.responseText=b.textContent?b.textContent:b.innerText)}}else"xml"==dt&&!xhr.responseXML&&xhr.responseText&&(xhr.responseXML=toXml(xhr.responseText));try{data=httpData(xhr,dt,s)}catch(e){status="parsererror",xhr.error=errMsg=e||status}}catch(e){log("error caught: ",e),status="error",xhr.error=errMsg=e||status}xhr.aborted&&(log("upload aborted"),status=null),xhr.status&&(status=xhr.status>=200&&xhr.status<300||304===xhr.status?"success":"error"),"success"===status?(s.success&&s.success.call(s.context,data,"success",xhr),g&&$.event.trigger("ajaxSuccess",[xhr,s])):status&&(void 0===errMsg&&(errMsg=xhr.statusText),s.error&&s.error.call(s.context,xhr,status,errMsg),g&&$.event.trigger("ajaxError",[xhr,s,errMsg])),g&&$.event.trigger("ajaxComplete",[xhr,s]),g&&!--$.active&&$.event.trigger("ajaxStop"),s.complete&&s.complete.call(s.context,xhr,status),callbackProcessed=!0,s.timeout&&clearTimeout(timeoutHandle),setTimeout((function(){s.iframeTarget||$io.remove(),xhr.responseXML=null}),100)}}}}},$.fn.ajaxForm=function(options){if((options=options||{}).delegation=options.delegation&&$.isFunction($.fn.on),!options.delegation&&0===this.length){var o={s:this.selector,c:this.context};return!$.isReady&&o.s?(log("DOM not ready, queuing ajaxForm"),$((function(){$(o.s,o.c).ajaxForm(options)})),this):(log("terminating; zero elements found by selector"+($.isReady?"":" (DOM not ready)")),this)}return options.delegation?($(document).off("submit.form-plugin",this.selector,doAjaxSubmit).off("click.form-plugin",this.selector,captureSubmittingElement).on("submit.form-plugin",this.selector,options,doAjaxSubmit).on("click.form-plugin",this.selector,options,captureSubmittingElement),this):this.ajaxFormUnbind().bind("submit.form-plugin",options,doAjaxSubmit).bind("click.form-plugin",options,captureSubmittingElement)},$.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")},$.fn.formToArray=function(semantic,elements){var a=[];if(0===this.length)return a;var i,j,n,v,el,max,jmax,form=this[0],els=semantic?form.getElementsByTagName("*"):form.elements;if(!els)return a;for(i=0,max=els.length;i<max;i++)if(n=(el=els[i]).name)if(semantic&&form.clk&&"image"==el.type)el.disabled||form.clk!=el||(a.push({name:n,value:$(el).val(),type:el.type}),a.push({name:n+".x",value:form.clk_x},{name:n+".y",value:form.clk_y}));else if((v=$.fieldValue(el,!0))&&v.constructor==Array)for(elements&&elements.push(el),j=0,jmax=v.length;j<jmax;j++)a.push({name:n,value:v[j]});else if(feature.fileapi&&"file"==el.type&&!el.disabled){elements&&elements.push(el);var files=el.files;if(files.length)for(j=0;j<files.length;j++)a.push({name:n,value:files[j],type:el.type});else a.push({name:n,value:"",type:el.type})}else null!=v&&(elements&&elements.push(el),a.push({name:n,value:v,type:el.type,required:el.required}));if(!semantic&&form.clk){var $input=$(form.clk),input=$input[0];(n=input.name)&&!input.disabled&&"image"==input.type&&(a.push({name:n,value:$input.val()}),a.push({name:n+".x",value:form.clk_x},{name:n+".y",value:form.clk_y}))}return a},$.fn.formSerialize=function(semantic){return $.param(this.formToArray(semantic))},$.fn.fieldSerialize=function(successful){var a=[];return this.each((function(){var n=this.name;if(n){var v=$.fieldValue(this,successful);if(v&&v.constructor==Array)for(var i=0,max=v.length;i<max;i++)a.push({name:n,value:v[i]});else null!=v&&a.push({name:this.name,value:v})}})),$.param(a)},$.fn.fieldValue=function(successful){for(var val=[],i=0,max=this.length;i<max;i++){var el=this[i],v=$.fieldValue(el,successful);null==v||v.constructor==Array&&!v.length||(v.constructor==Array?$.merge(val,v):val.push(v))}return val},$.fieldValue=function(el,successful){var n=el.name,t=el.type,tag=el.tagName.toLowerCase();if(void 0===successful&&(successful=!0),successful&&(!n||el.disabled||"reset"==t||"button"==t||("checkbox"==t||"radio"==t)&&!el.checked||("submit"==t||"image"==t)&&el.form&&el.form.clk!=el||"select"==tag&&-1==el.selectedIndex))return null;if("select"==tag){var index=el.selectedIndex;if(index<0)return null;for(var a=[],ops=el.options,one="select-one"==t,max=one?index+1:ops.length,i=one?index:0;i<max;i++){var op=ops[i];if(op.selected){var v=op.value;if(v||(v=op.attributes&&op.attributes.value&&!op.attributes.value.specified?op.text:op.value),one)return v;a.push(v)}}return a}return $(el).val()},$.fn.clearForm=function(includeHidden){return this.each((function(){$("input,select,textarea",this).clearFields(includeHidden)}))},$.fn.clearFields=$.fn.clearInputs=function(includeHidden){var re=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each((function(){var t=this.type,tag=this.tagName.toLowerCase();re.test(t)||"textarea"==tag?this.value="":"checkbox"==t||"radio"==t?this.checked=!1:"select"==tag?this.selectedIndex=-1:includeHidden&&(!0===includeHidden&&/hidden/.test(t)||"string"==typeof includeHidden&&$(this).is(includeHidden))&&(this.value="")}))},$.fn.resetForm=function(){return this.each((function(){("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset()}))},$.fn.enable=function(b){return void 0===b&&(b=!0),this.each((function(){this.disabled=!b}))},$.fn.selected=function(select){return void 0===select&&(select=!0),this.each((function(){var t=this.type;if("checkbox"==t||"radio"==t)this.checked=select;else if("option"==this.tagName.toLowerCase()){var $sel=$(this).parent("select");select&&$sel[0]&&"select-one"==$sel[0].type&&$sel.find("option").selected(!1),this.selected=select}}))},$.fn.ajaxSubmit.debug=!1}(jQuery);