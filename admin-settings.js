jQuery(document).ready(function($) {
    // 设置页面增强功能
    $('.dpk-admin-container').on('click', '.dpk-test-button', function() {
        var $button = $(this);
        $button.text('测试中...').prop('disabled', true);
        
        setTimeout(function() {
            $button.text('测试完成').prop('disabled', false);
            setTimeout(function() {
                $button.text('测试功能');
            }, 2000);
        }, 1000);
    });
    
    // 预设选项卡实时预览
    $('textarea[name="dpk_predefined_tabs"]').on('input', function() {
        var value = $(this).val();
        var lines = value.split('\n').filter(function(line) {
            return line.trim() !== '';
        });
        
        if (lines.length > 0) {
            $('#dpk-tabs-preview').remove();
            var preview = $('<div id="dpk-tabs-preview"><strong>预览:</strong> ' + lines.join(', ') + '</div>');
            $(this).after(preview);
        } else {
            $('#dpk-tabs-preview').remove();
        }
    }).trigger('input');
});