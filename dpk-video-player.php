<?php
/**
 * Plugin Name: DPK Video Player
 * Plugin URI: https://your-site.com
 * Description: 基于Mine Video Player布局的高级视频播放器
 * Version: 5.0.0
 * Author: Your Name
 * License: GPL v2 or later
 * Text Domain: dpk-video-player
 */

if (!defined('ABSPATH')) {
    exit;
}

define('DPK_VIDEO_PLAYER_VERSION', '5.1.1'); // 更新版本号强制刷新缓存
define('DPK_VIDEO_PLAYER_URL', plugin_dir_url(__FILE__));
define('DPK_VIDEO_PLAYER_PATH', plugin_dir_path(__FILE__));

class DPKVideoPlayer {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('init', array($this, 'init'));
    }
    
    public function init() {
        add_shortcode('dpk_player', array($this, 'player_shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }
    
    public function enqueue_scripts() {
        if (is_singular()) {
            wp_enqueue_style('dpk-video-player', DPK_VIDEO_PLAYER_URL . 'assets/dpk-video-player.css', array(), DPK_VIDEO_PLAYER_VERSION);
            wp_enqueue_script('dpk-video-player', DPK_VIDEO_PLAYER_URL . 'assets/dpk-video-player.js', array('jquery'), DPK_VIDEO_PLAYER_VERSION, true);
        }
    }
    
    public function player_shortcode($atts, $content = null) {
        $atts = shortcode_atts(array(
            'type' => '电影^直播^剧集',
            'vid' => ''
        ), $atts);
        
        // 解析视频数据
        $tabs = explode('^', $atts['type']);
        $videos_data = $this->parse_videos_data($atts['vid']);
        
        $player_id = 'dpk-player-' . uniqid();
        
        ob_start();
        ?>
        <div id="<?php echo $player_id; ?>" class="dpk-mine-style-player">
            <!-- 主播放器 -->
            <div class="dpk-video-container">
                <video id="dpk-main-video" controls playsinline webkit-playsinline>
                    您的浏览器不支持HTML5视频播放
                </video>
            </div>
            
            <!-- 选项卡 -->
            <div class="dpk-tabs-container">
                <?php foreach ($tabs as $index => $tab): ?>
                    <div class="dpk-tab <?php echo $index === 0 ? 'active' : ''; ?>" data-tab="<?php echo $index; ?>">
                        <?php echo esc_html(trim($tab)); ?>
                    </div>
                <?php endforeach; ?>
            </div>
            
            <!-- 视频列表 -->
            <div class="dpk-videos-list">
                <?php 
                $first_tab_videos = isset($videos_data[0]) ? $videos_data[0] : array();
                foreach ($first_tab_videos as $video_index => $video): 
                ?>
                    <div class="dpk-video-item <?php echo $video_index === 0 ? 'active' : ''; ?>" 
                         data-video-url="<?php echo esc_url($video['url']); ?>"
                         data-video-title="<?php echo esc_attr($video['title']); ?>"
                         data-tab-index="0"
                         data-video-index="<?php echo $video_index; ?>">
                        <div class="dpk-item-cover">
                            <img src="<?php echo esc_url($video['cover']); ?>" alt="<?php echo esc_attr($video['title']); ?>">
                            <div class="dpk-play-icon">▶</div>
                        </div>
                        <div class="dpk-item-info">
                            <div class="dpk-item-title"><?php echo esc_html($video['title']); ?></div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <script type="text/javascript">
            jQuery(document).ready(function($) {
                // 传递视频数据到前端
                var dpkPlayerData = {
                    tabs: <?php echo json_encode($tabs); ?>,
                    videos: <?php echo json_encode($videos_data); ?>
                };
                
                // 初始化播放器
                initMineStylePlayer('#<?php echo $player_id; ?>', dpkPlayerData);
            });
        </script>
        <?php
        return ob_get_clean();
    }
    
    
    /**
    private function parse_videos_data($vid_string) {
    $videos_by_tab = array();
    
    if (empty($vid_string)) {
        return $videos_by_tab;
    }
    
    // 首先按 ^ 分隔不同选项卡的视频组
    $tab_video_groups = explode('^', $vid_string);
    
    foreach ($tab_video_groups as $tab_index => $video_group) {
        // 按 , 分隔同一选项卡内的视频
        $video_entries = explode(',', $video_group);
        $videos_by_tab[$tab_index] = array();
        
        foreach ($video_entries as $entry) {
            $parts = explode('$', $entry);
            if (count($parts) >= 2) {
                $title = trim($parts[0]);
                $url = trim($parts[1]);
                $cover = count($parts) >= 3 ? trim($parts[2]) : DPK_VIDEO_PLAYER_URL . 'assets/default-cover.jpg';
                
                $videos_by_tab[$tab_index][] = array(
                    'title' => $title,
                    'url' => $url,
                    'cover' => $cover
                );
            }
        }
    }
    
    return $videos_by_tab;
}
    **/
    
    private function parse_videos_data($vid_string) {
        $videos_by_tab = array();
        
        if (empty($vid_string)) {
            return $videos_by_tab;
        }
        
        // 首先按 ^ 分隔不同选项卡的视频组
    $tab_video_groups = explode('^', $vid_string);
    
    foreach ($tab_video_groups as $tab_index => $video_group) {
        // 按 , 分隔同一选项卡内的视频
        $video_entries = explode(',', $video_group);
        $videos_by_tab[$tab_index] = array();
        
        foreach ($video_entries as $entry) {
            $parts = explode('$', $entry);
            if (count($parts) >= 2) {
                $title = trim($parts[0]);
                $url = trim($parts[1]);
                $cover = count($parts) >= 3 ? trim($parts[2]) : DPK_VIDEO_PLAYER_URL . 'assets/default-cover.jpg';
                
                $videos_by_tab[$tab_index][] = array(
                    'title' => $title,
                    'url' => $url,
                    'cover' => $cover
                );
            }
        }
    }
        
        return $videos_by_tab;
    }
}
    
    /**原来的代码
    private function parse_videos_data($vid_string) {
        $videos_by_tab = array();
        
        if (empty($vid_string)) {
            return $videos_by_tab;
        }
        
        // 解析类似Mine Video Player的格式
        $video_entries = explode(',', $vid_string);
        
        foreach ($video_entries as $index => $entry) {
            $parts = explode('$', $entry);
            if (count($parts) >= 2) {
                $title = trim($parts[0]);
                $url = trim($parts[1]);
                $cover = count($parts) >= 3 ? trim($parts[2]) : DPK_VIDEO_PLAYER_URL . 'assets/default-cover.jpg';
                
                // 默认分配到第一个选项卡，后续可以根据需要扩展
                $tab_index = 0;
                if (!isset($videos_by_tab[$tab_index])) {
                    $videos_by_tab[$tab_index] = array();
                }
                
                $videos_by_tab[$tab_index][] = array(
                    'title' => $title,
                    'url' => $url,
                    'cover' => $cover
                );
            }
        }
        
        return $videos_by_tab;
    }
}**/

DPKVideoPlayer::get_instance();