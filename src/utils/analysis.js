
import cheerio, { load } from 'cheerio';

const replaceFormItem = (str)=>{
    // uni-app 渲染html不支持原生表单 ，替换一下
    const regex =  /<(input|select)(?:(?!\btype\s*=\s*['"]?hidden\b)[^>])*?>/gi;
    
    return str.replace(regex, '____________');
};
export function getQuizInfo(html, type) {
    const $ = load(html);
    const obj = {};
    if (type === 'description') {
        obj.title = `${$('.accesshide')
            .text()}`;
        obj.qtext = `${$('.qtext')
            .html()}`;
        return obj;
    }
    obj.title = `${$('.no')
        .text()}`;
    obj.state = `${$('.state')
        .text()}`;
    obj.grade = `${$('.grade')
        .text()}`;
    obj.qtext = `${$('.qtext').length ? replaceFormItem($('.qtext')
        .html()) : ''}`;
    obj.prompt = `${$('.prompt')
        .text()}`;
    obj.validationerror = `${$('.validationerror')
        .text()}`;
    return obj;
}
export function getFeedback(html) {
    const $ = load(html);
    const obj = {};
    if ($('.feedback')) {
        obj.feedback = $('.feedback .specificfeedback')
            .text();
    }
    if ($('.rightanswer')) {
        obj.rightanswer = $('.rightanswer')
            .text();
    }
    return obj;
}
export function getTimes(html) {
    const $ = load(html);
    const obj = {};
    if ($('.formulation input[type="hidden"]')) {
        return $('.formulation input[type="hidden"]')
            .attr('name');
    }
}
export function choiceQuestion(html) {

    const $ = load(html);
    let items = [];

    if ($('.answer input[type="radio"]').length > 0) {

        $('.answer> div')
            .each((index, element) => {

                let answer;
                if ($('.answer label').length > 0) {
                    answer = $('.answer label')
                        .eq(index)
                        .text();
                } else {
                    answer = $('.answer .d-flex')
                        .eq(index)
                        .html();
                }

                items.push({
                    id: $('.answer input[type="radio"]')
                        .eq(index)
                        .prop('id'),
                    name: $('.answer input[type="radio"]')
                        .eq(index)
                        .attr('name'),
                    text: answer.replace(/<br>/g, ''),
                    value: $('.answer input[type="radio"]')
                        .eq(index)
                        .val(),
                    selected: $('.answer input[type="radio"]')
                        .eq(index)
                        .prop('checked'),
                    type: 'radio',
                    disabled: $('.answer input[type="radio"]')
                        .eq(index)
                        .prop('disabled'),
                    currect: $('.answer input[type="radio"]')
                        .eq(index)
                        .siblings('i')
                        .prop('title') || ''
                });
            });
    } else if ($('.answer input[type="checkbox"]').length > 0) {
        $('.answer> div')
            .each((index, element) => {
                let answer;
                if ($('.answer label').length > 0) {
                    answer = $('.answer label')
                        .eq(index)
                        .text();
                } else {
                    answer = $('.answer .d-flex')
                        .eq(index)
                        .html();
                }

                items.push({
                    id: $('.answer input[type="checkbox"]')
                        .eq(index)
                        .attr('id'),
                    text: answer.replace(/<br>/g, ''),
                    name: $('.answer input[type="checkbox"]')
                        .eq(index)
                        .attr('name'),
                    value: $('.answer input[type="checkbox"]')
                        .eq(index)
                        .val(),
                    selected: $('.answer input[type="checkbox"]')
                        .eq(index)
                        .prop('checked'),
                    type: 'checkbox',
                    disabled: $('.answer input[type="checkbox"]')
                        .eq(index)
                        .prop('disabled'),
                    currect: $('.answer input[type="checkbox"]')
                        .eq(index)
                        .siblings('i')
                        .prop('title') || ''
                });
            });
    }
    return items;
}
export function matchQuestion(html) {
    const $ = load(html);
    const arr = [];
    const getAnswers = ($, index) => {
        $('.answer tbody tr select')
            .eq(index)
            .children('option')
            .each((i, ele) => {
                arr[i] = {
                    text: $('.answer tbody tr select')
                        .find('option')
                        .eq(i)
                        .text(),
                    value: $('.answer tbody tr select')
                        .find('option')
                        .eq(i)
                        .val(),
                    selected: $('.answer tbody tr select')
                        .find('option')
                        .eq(i)
                        .prop('selected')
                };
            });
        return arr;
    };
    let items = [];
    $('.answer tbody >tr select')
        .each((index, ele) => {
            let options = ele.children.map(child => {
                const { attribs: { selected = '', value = '' }, children = [] } = child;
                if (children.length > 0) {
                    const text = value === '' ? '请选择' : children[0].data;
                    return {
                        text,
                        value,
                        selected: selected === 'selected'
                    };
                }
            });
            items.push({
                question: $('.text')
                    .eq(index)
                    .text(),
                options,
                name: $('.answer select')
                    .eq(index)
                    .attr('name'),
                currect: $('.answer select')
                    .eq(index)
                    .siblings('i')
                    .prop('title') || '',
                disabled:$('.answer select')
                    .eq(index)
                    .attr('disabled')
            });
        });
    return items;
}
export function shortanswerQusetion(html) {
    const $ = load(html);
    let el;
    if ($('.answer').length > 0) {
        el = $('.answer input[type="text"]');
    } else {
        el = $('input[type="text"]');
    }
    let items = {};
    if (el) {
        items.id = el.prop('id');
        items.name = el.attr('name');
        items.value = el.val();
        items.currect = el.siblings('i')
            .prop('title') || '';
        items.readonly =  el.attr('readonly');
    }
    return items;
}
export function essayQusetion(html) {
    const $ = load(html);
    const textarea = $('.answer textarea');
    const ipt = $('.answer input[type="hidden"]');
    let items = {};
    if (textarea.length > 0 && ipt) {
        items.id = textarea.prop('id');
        items.name = textarea.attr('name');
        items.value = textarea.val();
        items.format = ipt.attr('name');
        items.formatVal = ipt.val();
        items.rows = textarea.prop('rows');
    } else {
        const el = $('.answer .qtype_essay_editor');
        items.value = el.text();
    }
    return items;
}

export function multianswerQusetion(html){
    const $ = load(html);
    const formsDom = $('.form-control'); // 获取问题节点
    formsDom;
    const question = $('.content').html();

    const items = {};
    const forms = [];
    formsDom.map((index, node) => { // 解析表单对象
        if (node.attribs) {
            forms.push({
                ...node.attribs,
                currect:node.next  ? node.next.attribs.title || '' : ''
            });
        }
    });
    items.forms = forms;
    items.question=replaceFormItem(question);
    return items;
}
export function gapselectQusetion(html){
    const $ = load(html);
    const formsDom = $('select'); // 获取问题节点
    formsDom;
    const items = {};
    const forms = [];
    formsDom.map((index, node) => { // 解析表单对象
        const options = node.children.map((it) => {
            const { attribs: { selected = '', value = '' }, children = [] } = it;
            // if (selected === 'selected') selectedValue = value;
            if (children.length > 0) {
                const text = value === '' ? '请选择' : children[0].data;
                return {
                    text,
                    value,
                    selected: selected === 'selected'
                };
            }
        });
        if (node.attribs) {
            forms.push({
                ...node.attribs,
                options,
                currect:node.next && node.next.next ? node.next.next.attribs.title || '' : ''
            });
        }
    });
    items.forms = forms;
    return items;
}



