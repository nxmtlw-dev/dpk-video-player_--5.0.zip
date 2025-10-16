(function() {
    'use strict';
    
    tinymce.PluginManager.add('dpk_video_player', function(editor, url) {
        
        // 获取预设选项卡
        function getPredefinedTabs(callback) {
            if (window.wp && window.wp.ajax) {
                wp.ajax.post('dpk_get_predefined_tabs').done(function(response) {
                    callback(response.data || []);
                }).fail(function() {
                    callback([]);
                });
            } else {
                callback([]);
            }
        }
        
        // 添加按钮到工具栏
        editor.addButton('dpk_video_player', {
            text: 'DPK视频',
            icon: false,
            tooltip: '插入DPK视频系列',
            onclick: function() {
                getPredefinedTabs(function(tabs) {
                    var tabOptions = [];
                    tabs.forEach(function(tab) {
                        tabOptions.push({ text: tab, value: tab });
                    });
                    
                    // 打开自定义对话框
                    editor.windowManager.open({
                        title: '插入DPK视频系列',
                        body: [
                            {
                                type: 'textbox',
                                name: 'series_name',
                                label: '系列名称',
                                value: '我的视频系列'
                            },
                            {
                                type: 'textbox',
                                name: 'series_cover',
                                label: '系列封面URL (可选)',
                                value: ''
                            },
                            {
                                type: 'listbox',
                                name: 'preset_tab',
                                label: '预设选项卡',
                                values: [{ text: '-- 选择选项卡 --', value: '' }].concat(tabOptions)
                            },
                            {
                                type: 'textbox',
                                name: 'custom_tab',
                                label: '自定义选项卡',
                                value: ''
                            }
                        ],
                        onsubmit: function(e) {
                            // 构建短代码
                            var shortcode = '[dpk_series name="' + e.data.series_name + '"';
                            
                            if (e.data.series_cover) {
                                shortcode += ' cover="' + e.data.series_cover + '"';
                            }
                            
                            var selectedTab = e.data.preset_tab || e.data.custom_tab;
                            if (selectedTab) {
                                shortcode += ' tab="' + selectedTab + '"';
                            }
                            
                            shortcode += ']\n';
                            
                            // 添加示例视频
                            shortcode += '[dpk_video title="视频标题1" url="视频URL1"]\n';
                            shortcode += '[dpk_video title="视频标题2" url="视频URL2"]\n';
                            
                            shortcode += '[/dpk_series]';
                            
                            // 插入到编辑器
                            editor.insertContent(shortcode);
                        }
                    });
                });
            }
        });
    });
})();