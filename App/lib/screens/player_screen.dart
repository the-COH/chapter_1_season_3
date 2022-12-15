import 'dart:ui';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';

import '../modal/audio.dart';

class PlayerScreen extends StatefulWidget {
  const PlayerScreen({Key? key}) : super(key: key);

  @override
  State<PlayerScreen> createState() => _PlayerScreenState();
}

class _PlayerScreenState extends State<PlayerScreen> {
  final audioPlayer = AudioPlayer();
  bool isPlaying = false;
  Duration duration = Duration.zero;
  Duration position = Duration.zero;

  String currentPlayingName = '';

  List<Audio> playList = [
    Audio(
        name: 'the bear',
        desc: 'Navigate troubled waters',
        path: 'placeholderaudio1.mp3',
        isActive: true),
    Audio(
        name: 'crashing',
        desc: 'everything is crashing but now you know what to do',
        path: 'placeholderaudio1.mp3',
        isActive: true),
    Audio(
      name: 'rugs',
      desc: 'coming soon',
      path: 'placeholderaudio1.mp3',
      isActive: false,
    ),
  ];

  @override
  void initState() {
    super.initState();
    currentPlayingName = playList[0].name;
    setAudio(playList[0].path);
    audioPlayer.onPlayerStateChanged.listen((state) {
      setState(() {
        isPlaying = state == PlayerState.playing;
      });
    });

    audioPlayer.onPlayerComplete.listen((state) {
      setState(() {
        isPlaying = false;
        setAudio(playList
            .firstWhere((element) => element.name == currentPlayingName)
            .path);
      });
    });

    audioPlayer.onDurationChanged.listen((newDuration) {
      setState(() {
        duration = newDuration;
      });
    });

    audioPlayer.onPositionChanged.listen((newPosition) {
      setState(() {
        position = newPosition;
      });
    });
  }

  setAudio(path) async {
    //audioPlayer.setReleaseMode(ReleaseMode.loop);
    final player = AudioCache(prefix: 'assets/');
    final url = await player.load(path);
    await audioPlayer.setSourceUrl(url.path);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.grey,
        body: Column(
          children: [
            Expanded(
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(vertical: 60, horizontal: 40),
                child: Column(
                  children: [
                    ...playList.map((e) => GestureDetector(
                          onTap: () async {
                            if (!e.isActive) {
                              return;
                            }
                            setState(() {
                              currentPlayingName = e.name;
                            });
                            await setAudio(e.path);
                            audioPlayer.resume();
                          },
                          child: Container(
                            margin: const EdgeInsets.symmetric(vertical: 20),
                            color: e.isActive
                                ? Colors.red
                                : Colors.red.withOpacity(0.4),
                            child: ListTile(
                              title: e.isActive
                                  ? Text(
                                      e.name,
                                      style: TextStyle(fontSize: 22),
                                    )
                                  : ImageFiltered(
                                      imageFilter: ImageFilter.blur(
                                          sigmaX: 5, sigmaY: 5),
                                      child:
                                          Container(child: Text('your text')),
                                    ),
                              subtitle: Text(e.desc),
                              trailing: const Icon(
                                Icons.play_arrow,
                                color: Colors.greenAccent,
                                size: 32,
                              ),
                              selectedColor: Colors.red,
                            ),
                          ),
                        ))
                  ],
                ),
              ),
            ),
            Container(
              color: Colors.pink,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      currentPlayingName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                      ),
                    ),
                    GestureDetector(
                      onTap: () async {
                        if (isPlaying) {
                          await audioPlayer.pause();
                        } else {
                          await audioPlayer.resume();
                        }
                      },
                      child: Icon(
                        isPlaying ? Icons.pause : Icons.play_arrow,
                        color: Colors.white,
                        size: 32,
                      ),
                    )
                  ],
                ),
              ),
            )
          ],
        ));
  }
}
